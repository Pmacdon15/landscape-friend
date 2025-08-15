'use server'
import { updatedStripeAPIKeyDb, markPaidDb } from "@/lib/db";
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

//MARK: Helper function to convert ReadableStream to Buffer
const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};

//MARK: Update API key
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

//MARK: Create quote
export async function createStripeQuote(formData: FormData) {
    const { isAdmin, sessionClaims } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin")
    if (!sessionClaims) throw new Error("Session claims are missing.");
    const companyName = formatCompanyName({ orgName: sessionClaims.orgName as string, userFullName: sessionClaims.userFullName as string })

    const materials: { materialType: string, materialCostPerUnit: number, materialUnits: number }[] = [];
    let i = 0;
    while (formData.has(`materials.${i}.materialType`)) {
        materials.push({
            materialType: formData.get(`materials.${i}.materialType`) as string,
            materialCostPerUnit: Number(formData.get(`materials.${i}.materialCostPerUnit`)),
            materialUnits: Number(formData.get(`materials.${i}.materialUnits`)),
        });
        i++;
    }


    const validatedFields = schemaCreateQuote.safeParse({
        clientName: formData.get('clientName'),
        clientEmail: formData.get('clientEmail'),
        labourCostPerUnit: Number(formData.get('labourCostPerUnit')),
        labourUnits: Number(formData.get('labourUnits')),
        materials: materials,
    });

    if (!validatedFields.success) {
        console.error("Validation Error:", validatedFields.error);
        throw new Error("Invalid input data");
    }


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

        // 3. Handle Material Products and Prices
        const materialLineItems: { price: string; quantity: number; }[] = [];
        for (const material of validatedFields.data.materials) {

            // Skip material if materialType is empty or undefined
            if (!material.materialType) {
                console.warn("Skipping material due to empty materialType:", material);
                continue;
            }

            let materialPriceId: string;
            const materialProducts = await stripe.products.list({ limit: 100 });
            let materialProduct = materialProducts.data.find(product => product.name === material.materialType);
            if (!materialProduct) {
                materialProduct = await stripe.products.create({
                    name: material.materialType,
                });
            }

            const materialPrices = await stripe.prices.list({ limit: 100 });
            const materialPrice = materialPrices.data.find(
                price => price.product === materialProduct.id &&
                    price.unit_amount === Math.round((material.materialCostPerUnit ?? 0) * 100) &&
                    price.currency === 'cad'
            );
            if (!materialPrice) {
                const newPrice = await stripe.prices.create({
                    unit_amount: Math.round((material.materialCostPerUnit ?? 0) * 100),
                    currency: 'cad',
                    product: materialProduct.id,
                });
                materialPriceId = newPrice.id;
            } else {
                materialPriceId = materialPrice.id;
            }
            materialLineItems.push({ price: materialPriceId, quantity: material.materialUnits ?? 0 });
        }

        // 4. Create Line Items for the Quote
        const line_items = [
            { price: labourPriceId, quantity: validatedFields.data.labourUnits },
            ...materialLineItems,
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
        //TODO: Add check for if a valid quote and is valid email sent
        // Construct email content
        const emailSubject = `Your Quote from ${companyName}`;
        const emailBody = `Dear ${validatedFields.data.clientName},

Please find your quote attached. Please reply to this email to confirm the quote.

Thank you!`

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
//MARK: Resend invoice 
export async function resendInvoice(invoiceId: string) {
    const { isAdmin, sessionClaims } = await isOrgAdmin()
    if (!isAdmin) throw new Error("Not Admin")
    const stripe = getStripeInstance();
    //TODO: when in Prod ther eis not need for use to send the email strip will do that

    try {
        const invoice: Stripe.Invoice = await stripe.invoices.sendInvoice(invoiceId);

        if (!invoice.id) throw new Error("Invoice ID is missing after resending.");

        const customerEmail = invoice.customer_email;
        const customerName = invoice.customer_name || invoice.customer?.toString() || 'Valued Customer';
        const hostedInvoiceUrl = invoice.hosted_invoice_url;

        if (!customerEmail) throw new Error("Customer email not found for invoice.");
        if (!hostedInvoiceUrl) throw new Error("Hosted invoice URL not found for invoice.");

        const companyName = formatCompanyName({ orgName: sessionClaims?.orgName as string, userFullName: sessionClaims?.userFullName as string });

        const emailSubject = `Your Invoice from ${companyName}`;
        const emailBody = `Dear ${customerName},

                            Please find your invoice here: ${hostedInvoiceUrl}

                            Thank you for your business!`;

        const formDataForEmail = new FormData();
        formDataForEmail.append('title', emailSubject);
        formDataForEmail.append('message', emailBody);

        const emailResult = await sendEmailWithTemplate(formDataForEmail, customerEmail);

        if (!emailResult) {
            throw new Error("Failed to send invoice email.");
        }

        console.log("Invoice re-sent and email sent successfully:", invoice.id);
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to resend invoice ${invoiceId}`);
    }
}

//MARK:Mark invoice paid
export async function markInvoicePaid(invoiceId: string) {
    const { isAdmin, orgId, userId } = await isOrgAdmin()
    if (!isAdmin) throw new Error("Not Admin")
    if (!userId) throw new Error("No user")

    const stripe = getStripeInstance();
    try {
        const invoice = await stripe.invoices.pay(invoiceId, {
            paid_out_of_band: true,
        });

        const customerEmail = invoice.customer_email

        // Call markPaidDb to update local database
        if (customerEmail) { // orgId is already checked above
            const amountPaid = Number(invoice.amount_due / 100); // Convert cents to dollars
            const dbUpdateResult = await markPaidDb(invoiceId, customerEmail, amountPaid, orgId || userId); // Pass orgId directly
            if (!dbUpdateResult.success) {
                console.warn(`Failed to update local database for invoice ${invoiceId}: ${dbUpdateResult.message}`);
                // Optionally, throw an error or handle this failure more robustly
            }
        } else {
            console.warn(`Skipping local DB update for invoice ${invoiceId}: Missing customer email.`);
        }

    } catch (error) {
        console.error(error);
        throw new Error(`Failed to mark invoice ${invoiceId} as paid`);
    }
}
//MARK:Mark invoice void
export async function markInvoiceVoid(invoiceId: string) {
    const { isAdmin, orgId, userId } = await isOrgAdmin()
    if (!isAdmin) throw new Error("Not Admin")
    if (!userId) throw new Error("No user")

    const stripe = getStripeInstance();
    try {
        const invoice = await stripe.invoices.voidInvoice(invoiceId);

        const customerEmail = invoice.customer_email

        // Call markPaidDb to update local database
        if (customerEmail) { // orgId is already checked above
            const amountPaid = Number(invoice.amount_due / 100); // Convert cents to dollars
            const dbUpdateResult = await markPaidDb(invoiceId, customerEmail, amountPaid, orgId || userId); // Pass orgId directly
            if (!dbUpdateResult.success) {
                console.warn(`Failed to update local database for invoice ${invoiceId}: ${dbUpdateResult.message}`);
                // Optionally, throw an error or handle this failure more robustly
            }
        } else {
            console.warn(`Skipping local DB update for invoice ${invoiceId}: Missing customer email.`);
        }

    } catch (error) {
        console.error(error);
        throw new Error(`Failed to mark invoice ${invoiceId} as paid`);
    }
}