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
        stripe = new Stripe(apiKey);
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

export async function createStripeQuote(
    clientName: string,
    clientEmail: string,
    labourCostPerUnit: number,
    labourUnits: number,
    materialType: string,
    materialCostPerUnit: number,
    materialUnits: number
) {
    try {
        const stripe = getStripeInstance();

        // 1. Find or Create Customer
        let customerId: string;
        const existingCustomers = await stripe.customers.list({ email: clientEmail, limit: 1 });
        if (existingCustomers.data.length > 0) {
            customerId = existingCustomers.data[0].id;
        } else {
            const newCustomer = await stripe.customers.create({
                name: clientName,
                email: clientEmail,
            });
            customerId = newCustomer.id;
        }

        // 2. Handle Labour Product and Price
        let labourPriceId: string;
        const labourProducts = await stripe.products.list({ limit: 100 });
        let labourProduct = labourProducts.data.find(product => product.name === 'Labour');
        if (!labourProduct) {
            labourProduct = await stripe.products.create({
                name: 'Labour',
            });
        }

        const labourPrices = await stripe.prices.list({ limit: 100 });
        const labourPrice = labourPrices.data.find(
            price => price.product === labourProduct.id &&
                     price.unit_amount === Math.round(labourCostPerUnit * 100) &&
                     price.currency === 'cad'
        );
        if (!labourPrice) {
            const newPrice = await stripe.prices.create({
                unit_amount: Math.round(labourCostPerUnit * 100),
                currency: 'cad',
                product: labourProduct.id,
            });
            labourPriceId = newPrice.id;
        } else {
            labourPriceId = labourPrice.id;
        }

        // 3. Handle Material Product and Price
        let materialPriceId: string;
        const materialProducts = await stripe.products.list({ limit: 100 });
        let materialProduct = materialProducts.data.find(product => product.name === materialType);
        if (!materialProduct) {
            materialProduct = await stripe.products.create({
                name: materialType,
            });
        }

        const materialPrices = await stripe.prices.list({ limit: 100 });
        const materialPrice = materialPrices.data.find(
            price => price.product === materialProduct.id &&
                     price.unit_amount === Math.round(materialCostPerUnit * 100) &&
                     price.currency === 'usd'
        );
        if (!materialPrice) {
            const newPrice = await stripe.prices.create({
                unit_amount: Math.round(materialCostPerUnit * 100),
                currency: 'usd',
                product: materialProduct.id,
            });
            materialPriceId = newPrice.id;
        } else {
            materialPriceId = materialPrice.id;
        }

        // 4. Create Line Items for the Quote
        const line_items = [
            { price: labourPriceId, quantity: labourUnits },
            { price: materialPriceId, quantity: materialUnits },
        ];

        const quote = await stripe.quotes.create({
            customer: customerId,
            line_items: line_items,
        });

        return { success: true, quoteId: quote.id };
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("Error creating Stripe quote:", errorMessage);
        return { success: false, message: errorMessage };
    }
}