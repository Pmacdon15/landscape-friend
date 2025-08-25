'use server'
import Stripe from 'stripe';
import { addClientDB, updateClientStripeCustomerIdDb } from '@/lib/DB/db-clients';
import { storeWebhookSecretDb } from '@/lib/DB/db-stripe';

let stripe: Stripe | null = null;

function getStripeInstance(): Stripe {
    if (!stripe) {
        const apiKey = process.env.STRIPE_SECRET_KEY; // Or fetch from DB
        if (!apiKey) {
            throw new Error('Stripe secret key not configured.');
        }
        stripe = new Stripe(apiKey);
    }
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
    const existingCustomers = await stripe.customers.list({ email: clientEmail, limit: 1 });

    if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
        console.log("Existing Stripe customer found:", customerId);
        // Update existing client with Stripe customer ID
        try {
            const result = await updateClientStripeCustomerIdDb(clientEmail, customerId, effectiveOrgId);
            console.log("updateClientStripeCustomerIdDb result:", result);
            console.log("updateResult.length:", result.length);
            if (result.length === 0) {
                // No client found with that email and organization_id, so create a new one
                console.log("No existing client found for email and organization, creating new client.");
                const newClientData = {
                    full_name: clientName,
                    phone_number: Number(phoneNumber),
                    email_address: clientEmail,
                    address: address,
                    stripe_customer_id: customerId,
                    organization_id: effectiveOrgId as string,
                };
                const addResult = await addClientDB(newClientData, effectiveOrgId as string);
                console.log("addClientDB result (after update failed):", addResult);
            }
        } catch (error) {
            console.error("Error in updateClientStripeCustomerIdDb or subsequent addClientDB:", error);
            throw error; // Re-throw the error
        }
    } else {
        console.log("No existing Stripe customer found, creating new one.");
        try {
            const newCustomer = await stripe.customers.create({
                name: clientName,
                email: clientEmail,
            });
            customerId = newCustomer.id;
            console.log("New Stripe customer created:", customerId);

            // Create new client in local DB with Stripe customer ID
            const newClientData = {
                full_name: clientName,
                phone_number: Number(phoneNumber),
                email_address: clientEmail,
                address: address,
                stripe_customer_id: customerId,
                organization_id: effectiveOrgId as string,
            };
            console.log("Attempting to add new client to DB with data:", newClientData);
            const addResult = await addClientDB(newClientData, effectiveOrgId as string);
            console.log("addClientDB result:", addResult);
        } catch (error) {
            console.error("Error in creating Stripe customer or addClientDB:", error);
            throw error; // Re-throw the error
        }
    }
    return customerId;
}

export async function createStripeWebhook( apiKey: string, organizationId: string): Promise<void> {
    const stripe = new Stripe(apiKey);
    const webhookUrl = `https://landscapefriend.com/api/webhooks/stripe/${organizationId}`;

    try {
        const webhook = await stripe.webhookEndpoints.create({
            url: webhookUrl,
            enabled_events: [
                'invoice.paid',
                'invoice.payment_failed',
                'customer.subscription.created',
                'customer.subscription.deleted',
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
