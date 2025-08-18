import Stripe from 'stripe';
import { addClientDB, updateClientStripeCustomerIdDb } from '@/lib/DB/db-clients';

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
    console.log("findOrCreateStripeCustomerAndLinkClient called with:", {
        clientName, clientEmail, phoneNumber, address, organization_id
    });
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
        } catch (error) {
            console.error("Error in updateClientStripeCustomerIdDb:", error);
        }
    } else {
        console.log("No existing Stripe customer found, creating new one.");
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
            organization_id: effectiveOrgId as string, // Add organization_id here
        };
        console.log("Attempting to add new client to DB with data:", newClientData);
        try {
            const result = await addClientDB(newClientData, effectiveOrgId);
            console.log("addClientDB result:", result);
        } catch (error) {
            console.error("Error in addClientDB:", error);
        }
    }
    return customerId;
}
