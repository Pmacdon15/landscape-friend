'use server'

import { updatedStripeAPIKeyDb } from "@/lib/db";
import { isOrgAdmin } from "@/lib/webhooks";
import { schemaUpdateAPI, schemaCreateQuote } from "@/lib/zod/schemas";
import { sendEmailWithTemplate } from '@/actions/sendEmails';
import Stripe from 'stripe'; // Import Stripe
import { Buffer } from 'buffer';
import { formatCompanyName } from "@/lib/resend";

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

// Helper function to convert ReadableStream to Buffer
const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};

export async function updateStripeAPIKey({ formData }: { formData: FormData }) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaUpdateAPI.safeParse({
        APIKey: formData.get("api_key"),
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await updatedStripeAPIKeyDb(validatedFields.data, (orgId || userId)!)
        if (!result.success) throw new Error(result.message);
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function createStripeQuote(formData: FormData) {
    const { isAdmin, sessionClaims } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin")
    if (!sessionClaims) throw new Error("Session claims are missing.");
    const companyName = formatCompanyName({ orgName: sessionClaims.orgName as string, userFullName: sessionClaims.userFullName as string })
    
    const validatedFields = schemaCreateQuote.safeParse({
        clientName: formData.get('clientName'),
        clientEmail: formData.get('clientEmail'),
        labourCostPerUnit: Number(formData.get('labourCostPerUnit')),
        labourUnits: Number(formData.get('labourUnits')),
        materialType: formData.get('materialType'),
        materialCostPerUnit: Number(formData.get('materialCostPerUnit')),
        materialUnits: Number(formData.get('materialUnits')),
    });
    
    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        if (!isAdmin) throw new Error("Not Admin")
        const stripe = getStripeInstance();

        // 1. Find or Create Customer
        let customerId: string;
        const existingCustomers = await stripe.customers.list({ email: validatedFields.data.clientEmail, limit: 1 });
        if (existingCustomers.data.length > 0) {
            customerId = existingCustomers.data[0].id;
        } else {
            const newCustomer = await stripe.customers.create({
                name: validatedFields.data.clientName,
                email: validatedFields.data.clientEmail,
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
                price.unit_amount === Math.round(validatedFields.data.labourCostPerUnit * 100) &&
                price.currency === 'cad'
        );
        if (!labourPrice) {
            const newPrice = await stripe.prices.create({
                unit_amount: Math.round(validatedFields.data.labourCostPerUnit * 100),
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
        let materialProduct = materialProducts.data.find(product => product.name === validatedFields.data.materialType);
        if (!materialProduct) {
            materialProduct = await stripe.products.create({
                name: validatedFields.data.materialType,
            });
        }

        const materialPrices = await stripe.prices.list({ limit: 100 });
        const materialPrice = materialPrices.data.find(
            price => price.product === materialProduct.id &&
                price.unit_amount === Math.round(validatedFields.data.materialCostPerUnit * 100) &&
                price.currency === 'cad'
        );
        if (!materialPrice) {
            const newPrice = await stripe.prices.create({
                unit_amount: Math.round(validatedFields.data.materialCostPerUnit * 100),
                currency: 'cad',
                product: materialProduct.id,
            });
            materialPriceId = newPrice.id;
        } else {
            materialPriceId = materialPrice.id;
        }

        // 4. Create Line Items for the Quote
        const line_items = [
            { price: labourPriceId, quantity: validatedFields.data.labourUnits },
            { price: materialPriceId, quantity: validatedFields.data.materialUnits },
        ];

        const quote = await stripe.quotes.create({
            customer: customerId,
            line_items: line_items,
        });
        //TODO: maybe not finalize and do later on a page yet to be made 
        // Finalize the quote immediately
        const finalizedQuote = await stripe.quotes.finalizeQuote(quote.id);

        if (!finalizedQuote.id) throw new Error("Failed")

        // Download the PDF using Stripe's built-in method
        const pdfStream = await stripe.quotes.pdf(finalizedQuote.id);
        const pdfContent = await streamToBuffer(pdfStream);

        // Prepare attachment
        const attachments = [{
            filename: `quote_${finalizedQuote.id}.pdf`,
            content: pdfContent,
        }];
        if (!quote.id) throw new Error("Failed")
        //TODO: Add check for if valid quote and is valid email sent
        // Construct email content
        const emailSubject = `Your Quote from ${companyName}`;
        const emailBody = `Dear ${validatedFields.data.clientName},\n\nPlease find your quote attached. Please reply to this email to confirm the quote.\n\nThank you!`

        // Create FormData for sendEmailWithTemplate
        const formDataForEmail = new FormData();
        formDataForEmail.append('title', emailSubject);
        formDataForEmail.append('message', emailBody);

        // Send the email with attachment
        const emailResult = await sendEmailWithTemplate(formDataForEmail, validatedFields.data.clientEmail, attachments);
        if (!emailResult) {
            throw new Error("Failed");
        }

        return { success: true, quoteId: finalizedQuote.id };
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("Error creating Stripe quote:", errorMessage);
        return { success: false, message: errorMessage };
    }
}