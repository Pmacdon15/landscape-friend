'use server'

import { updatedStripeAPIKeyDb } from "@/lib/db";
import { isOrgAdmin } from "@/lib/webhooks";
import { schemaUpdateAPI } from "@/lib/zod/schemas";
import Stripe from 'stripe'; // Import Stripe

// Placeholder for getting Stripe instance. In a real app, this would fetch the API key securely.
// For now, assuming it's available via environment variable or a secure utility.
let stripe: Stripe | null = null;

function getStripeInstance(): Stripe {
    if (!stripe) {
        const apiKey = process.env.STRIPE_SECRET_KEY; // Or fetch from DB
        if (!apiKey) {
            throw new Error('Stripe secret key not configured.');
        }
        stripe = new Stripe(apiKey, {
            apiVersion: '2025-07-30.basil', // Use your desired API version
        });
    }
    return stripe;
}

export async function updateStripeAPIKey({ formData }: { formData: FormData }) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const validatedFields = schemaUpdateAPI.safeParse({
        APIKey: formData.get("api_key"),
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {        
        const result = await updatedStripeAPIKeyDb(validatedFields.data, orgId || userId)
        if (!result.success) throw new Error(result.message);
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

interface QuoteItem {
    price: string; // Stripe Price ID
    quantity: number;
}

export async function createStripeQuote(customerId: string, items: QuoteItem[]) {
    try {
        const stripe = getStripeInstance();

        const line_items = items.map(item => ({
            price: item.price,
            quantity: item.quantity,
        }));

        const quote = await stripe.quotes.create({
            customer: customerId,
            line_items: line_items,
            // You can add more quote parameters here as needed, e.g.,
            // expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days from now
            // description: 'Quote for lawn maintenance services',
        });

        return { success: true, quoteId: quote.id, quoteUrl: quote.url };
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("Error creating Stripe quote:", errorMessage);
        return { success: false, message: errorMessage };
    }
}


