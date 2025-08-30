'use server'
import Stripe from 'stripe';
import { addClientDB, updateClientStripeCustomerIdDb } from '@/lib/DB/db-clients';
import { fetchStripAPIKeyDb, storeWebhookSecretDb } from '@/lib/DB/db-stripe';
import { getStripeInstance } from '../dal/stripe-dal';

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
        // console.log("Existing Stripe customer found:", customerId);
        // Update existing client with Stripe customer ID
        try {
            const result = await updateClientStripeCustomerIdDb(clientEmail, customerId, effectiveOrgId);
            // console.log("updateClientStripeCustomerIdDb result:", result);
            // console.log("updateResult.length:", result.length);
            if (result.length === 0) {
                // No client found with that email and organization_id, so create a new one
                // console.log("No existing client found for email and organization, creating new client.");
                const newClientData = {
                    full_name: clientName,
                    phone_number: Number(phoneNumber),
                    email_address: clientEmail,
                    address: address,
                    stripe_customer_id: customerId,
                    organization_id: effectiveOrgId as string,
                };
                await addClientDB(newClientData, effectiveOrgId as string);
                // console.log("addClientDB result (after update failed):", addResult);
            }
        } catch (error) {
            console.error("Error in updateClientStripeCustomerIdDb or subsequent addClientDB:", error);
            throw error; // Re-throw the error
        }
    } else {
        console.log("No existing Stripe customer found, creating new one.");
        try {
            const newCustomer = await (await stripe).customers.create({
                name: clientName,
                email: clientEmail,
            });
            customerId = newCustomer.id;
            // console.log("New Stripe customer created:", customerId);

            // Create new client in local DB with Stripe customer ID
            const newClientData = {
                full_name: clientName,
                phone_number: Number(phoneNumber),
                email_address: clientEmail,
                address: address,
                stripe_customer_id: customerId,
                organization_id: effectiveOrgId as string,
            };
            // console.log("Attempting to add new client to DB with data:", newClientData);
            await addClientDB(newClientData, effectiveOrgId as string);
            // console.log("addClientDB result:", addResult);
        } catch (error) {
            console.error("Error in creating Stripe customer or addClientDB:", error);
            throw error; // Re-throw the error
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
            console.log("Existing Stripe webhook deleted:", existingWebhook.id);
        }

        const webhook = await stripe.webhookEndpoints.create({
            url: webhookUrl,
            enabled_events: [
                'invoice.paid',
                'invoice.sent'
            ],
        });
        // console.log("Stripe webhook created:", webhook);
        console.log("Stripe webhook secret:", webhook.secret);
        if (webhook.secret) {
            await storeWebhookSecretDb(organizationId, webhook.secret);
        }
        // return webhook;
    } catch (error) {
        console.error("Error creating Stripe webhook:", error);
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
    quote: {
        amount: ((invoice.total ?? 0) / 100).toString(),
        id: invoice.id || "",
    },
    client: {
        name: clientName,
    },
});