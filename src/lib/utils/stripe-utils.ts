import Stripe from 'stripe';
import { addClientDB, updateClientStripeCustomerIdDb } from '@/lib/DB/clients-db';
import { fetchStripAPIKeyDb, storeWebhookInfoDb, fetchWebhookIdDb, deleteWebhookIdDb } from '@/lib/DB/stripe-db';
import { getStripeInstance } from '../dal/stripe-dal';
import { schemaCreateSubscription } from '../zod/schemas';
import z from 'zod';

let stripe: Stripe | null = null;

export async function getStripeInstanceUnprotected(orgId: string): Promise<Stripe> {

    const apiKeyResponse = await fetchStripAPIKeyDb(orgId);
    if (apiKeyResponse instanceof Error) {
        throw new Error('Stripe secret key not configured.');
    }

    const apiKey = apiKeyResponse.api_key;
    if (!apiKey) {
        throw new Error('Stripe secret key not configured.');
    }

    stripe = new Stripe(apiKey);
    return stripe;
}


export async function findOrCreateStripeCustomerAndLinkClient(
    clientName: string,
    clientEmail: string,
    phoneNumber: string,
    address: string,
    organization_id: string | undefined
): Promise<string> {

    const stripe = getStripeInstance();

    const effectiveOrgId = organization_id;
    if (!effectiveOrgId) {
        throw new Error("Organization ID is missing.");
    }

    let customerId: string;
    const existingCustomers = await (await stripe).customers.list({ email: clientEmail, limit: 1 });

    if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
        try {
            const result = await updateClientStripeCustomerIdDb(clientEmail, customerId, effectiveOrgId);
            if (result.length === 0) {
                const newClientData = {
                    full_name: clientName,
                    phone_number: Number(phoneNumber),
                    email_address: clientEmail,
                    address: address,
                    stripe_customer_id: customerId,
                    organization_id: effectiveOrgId as string,
                };
                await addClientDB(newClientData, effectiveOrgId as string);
            }
        } catch (error) {
            console.error("Error in updateClientStripeCustomerIdDb or subsequent addClientDB:", error);
            throw error;
        }
    } else {
        console.log("No existing Stripe customer found, creating new one.");
        try {
            const newCustomer = await (await stripe).customers.create({
                name: clientName,
                email: clientEmail,
            });
            customerId = newCustomer.id;

            const newClientData = {
                full_name: clientName,
                phone_number: Number(phoneNumber),
                email_address: clientEmail,
                address: address,
                stripe_customer_id: customerId,
                organization_id: effectiveOrgId as string,
            };
            await addClientDB(newClientData, effectiveOrgId as string);
        } catch (error) {
            console.error("Error in creating Stripe customer or addClientDB:", error);
            throw error;
        }
    }
    return customerId;
}

export async function createStripeWebhook(apiKey: string, organizationId: string): Promise<void> {
    const stripe = new Stripe(apiKey);
    const webhookUrl = `https://www.landscapefriend.com/api/webhooks/stripe/${organizationId}`;

    try {
        const webhooks = await stripe.webhookEndpoints.list();
        const existingWebhook = webhooks.data.find(webhook => webhook.url === webhookUrl);

        if (existingWebhook) {
            await stripe.webhookEndpoints.del(existingWebhook.id);
        }

        const webhook = await stripe.webhookEndpoints.create({
            url: webhookUrl,
            enabled_events: [
                'invoice.paid',
                'invoice.sent'
            ],
        });

        if (webhook.secret) {
            await storeWebhookInfoDb(organizationId, webhook.secret, webhook.id);
        }
    } catch (error) {
        console.error("Error creating Stripe webhook:", error);
        throw error;
    }
}

export async function deleteStripeWebhookRoute(orgId: string) {
    try {
        const apiKey = await fetchStripAPIKeyDb(orgId);
        const webhookId = await fetchWebhookIdDb(orgId);

        if (apiKey && webhookId) {
            const stripe = new Stripe(apiKey.api_key);
            await stripe.webhookEndpoints.del(webhookId.webhook_id);
            await deleteWebhookIdDb(orgId);
        }
    } catch (error) {
        console.error("Error deleting Stripe webhook:", error);
        throw error;
    }
}

export const createNotificationPayloadQuote = async (quote: Stripe.Response<Stripe.Quote>, clientName: string) => ({
    quote: {
        amount: ((quote.amount_total ?? 0) / 100).toString(),
        id: quote.id || "",
    },
    client: {
        name: clientName,
    },
});


export const createNotificationPayloadInvoice = async (invoice: Stripe.Response<Stripe.Invoice>, clientName: string) => ({
    invoice: {
        amount: ((invoice.total ?? 0) / 100).toString(),
        id: invoice.id || "",
    },
    client: {
        name: clientName,
    },
});


export async function getStripeCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    const stripe = await getStripeInstance();
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    return customers.data.length > 0 ? customers.data[0] : null;
}

export async function createStripeCustomer(customerData: {
    email: string;
    name?: string;
    address?: { line1: string };
    phone?: string;
    metadata?: { [key: string]: string };
}): Promise<Stripe.Customer> {
    const stripe = await getStripeInstance();
    const customer = await stripe.customers.create(customerData);
    return customer;
}



export async function createStripeSubscription(subscriptionData: z.infer<typeof schemaCreateSubscription>) {
    const { clientEmail, clientName, address, phone_number, price_per_month_grass, serviceType, startDate, endDate, organization_id } = subscriptionData;

    stripe = await getStripeInstanceUnprotected(organization_id)
    if(!Stripe) throw new Error("No Stripe Intinastance ")
    let customerId: string;

    // 1. Check for existing Stripe customer or create a new one
    let customer = await getStripeCustomerByEmail(clientEmail);

    if (!customer) {
        customer = await createStripeCustomer({
            email: clientEmail,
            name: clientName,
            address: { line1: address },
            phone: phone_number,
            metadata: { organization_id: organization_id },
        });
        customerId = customer.id;
    } else {
        customerId = customer.id;
    }

    // 2. Create a Stripe Product and Price for the subscription
    // This assumes a simple product/price model. For more complex scenarios, you might pre-create these.
    const productName = `Lawn Mowing - ${serviceType} for ${clientName}`;
    const product = await stripe.products.create({
        name: productName,
        type: 'service',
        metadata: { organization_id: organization_id, serviceType: serviceType },
    });

    const price = await stripe.prices.create({
        unit_amount: Math.round(price_per_month_grass * 100), // Convert to cents
        currency: 'cad',
        recurring: { interval: 'month' },
        product: product.id,
        metadata: { organization_id: organization_id, serviceType: serviceType },
    });

    // 3. Create the Stripe Subscription
    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: price.id }],
        collection_method: 'send_invoice',
        days_until_due: 7, // Example: invoice 7 days before renewal
        metadata: {
            organization_id: organization_id,
            clientEmail: clientEmail,
            serviceType: serviceType,
            startDate: startDate,
            endDate: endDate || '' // Store endDate if available
        },
    });

    // TODO: Save subscription details to your local database if needed

    return subscription;
}
