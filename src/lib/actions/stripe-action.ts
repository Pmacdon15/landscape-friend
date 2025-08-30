'use server'
import { findOrCreateStripeCustomerAndLinkClient } from "@/lib/server-funtions/stripe-utils";
import { isOrgAdmin } from "@/lib/server-funtions/clerk";
import { schemaUpdateAPI, schemaCreateQuote, schemaUpdateStatement } from "@/lib/zod/schemas";
import { sendEmailWithTemplate } from '@/lib/actions/sendEmails-action';
import Stripe from 'stripe';
import { Buffer } from 'buffer';
import { formatCompanyName } from "@/lib/server-funtions/resend";
import { updatedStripeAPIKeyDb } from "@/lib/DB/db-stripe";
import { MarkQuoteProps } from "@/types/types-stripe";
import { fetchNovuId } from "../dal/user-dal";
import { triggerNotifaction } from "../dal/novu-dal";
import { getInvoiceDAL, getStripeInstance } from "../dal/stripe-dal";
import { hasStripAPIKey } from "../dal/stripe-dal";

//MARK: Helper function to convert ReadableStream to Buffer
const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};

import { createStripeWebhook } from "../server-funtions/stripe-utils";
import { markPaidDb } from "../DB/db-clients";

//MARK: Update API key
export async function updateStripeAPIKey({ formData }: { formData: FormData }) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");
    let novuId
    if (userId) novuId = await fetchNovuId(userId)

    const validatedFields = schemaUpdateAPI.safeParse({
        APIKey: formData.get("api_key"),
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await updatedStripeAPIKeyDb(validatedFields.data, (orgId || userId)!)
        if (!result.success) throw new Error(result.message);

        await createStripeWebhook(validatedFields.data.APIKey, orgId || userId!);

        if (novuId) await triggerNotifaction(novuId.UserNovuId, "stripe-api-key-updated")
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

import { z } from 'zod';
import { triggerNotificationSendToAdmin } from "../server-funtions/novu";

//MARK: Create quote
export async function createStripeQuote(quoteData: z.infer<typeof schemaCreateQuote>) {
    const { isAdmin, orgId, userId, sessionClaims } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin")
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");
    const companyName = formatCompanyName({ orgName: sessionClaims?.orgName as string, userFullName: sessionClaims?.userFullName as string })

    const validatedFields = schemaCreateQuote.safeParse(quoteData);

    if (!validatedFields.success) {
        console.error("Validation Error:", validatedFields.error);
        throw new Error("Invalid input data");
    }


    try {
        if (!isAdmin) throw new Error("Not Admin")
        const stripe = await getStripeInstance();

        // 1. Find or Create Customer
        const customerId = await findOrCreateStripeCustomerAndLinkClient(
            validatedFields.data.clientName,
            validatedFields.data.clientEmail,
            validatedFields.data.phone_number,
            validatedFields.data.address,
            validatedFields.data.organization_id
        );


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
            collection_method: 'send_invoice',
            invoice_settings: { days_until_due: 30 },
        });

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

//MARK: Update invoice
export async function updateStripeInvoice(invoiceData: z.infer<typeof schemaUpdateStatement>) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaUpdateStatement.safeParse({
        ...invoiceData,
        organization_id: orgId || userId,
    });

    if (!validatedFields.success) {
        console.error("Validation Error:", validatedFields.error);
        throw new Error("Invalid input data");
    }

    try {
        const stripe = await getStripeInstance();
        const existingInvoice = await getInvoiceDAL(validatedFields.data.id);

        if (!existingInvoice) throw new Error("Invoice not found");

        // Delete existing line items
        for (const item of existingInvoice.lines.data) await stripe.invoiceItems.del(item.id);


        // Create new line items
        const line_items = validatedFields.data.lines.map(line => ({
            customer: existingInvoice.customer as string,
            invoice: validatedFields.data.id,
            unit_amount_decimal: String(Math.round(line.amount * 100)),
            currency: 'cad',
            description: line.description,
            quantity: line.quantity,
        }));

        // console.log('Line items with amounts:', line_items.map(item => item.unit_amount_decimal));

        for (const item of line_items) await stripe.invoiceItems.create(item);

        triggerNotificationSendToAdmin(orgId || userId!, 'invoice-edited', { invoiceId: validatedFields.data.id })

        return { success: true };
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("Error updating Stripe invoice:", errorMessage);
        return { success: false, message: errorMessage };
    }
}

//MARK: Resend invoice 
export async function resendInvoice(invoiceId: string) {
    const { isAdmin, sessionClaims } = await isOrgAdmin()
    if (!isAdmin) throw new Error("Not Admin")
    const stripe = await getStripeInstance();
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
    const { isAdmin } = await isOrgAdmin()
    if (!isAdmin) throw new Error("Not Admin")

    const stripe = await getStripeInstance();
    try {
        await stripe.invoices.pay(invoiceId, {
            paid_out_of_band: true,
        });

        //     const customerEmail = invoice.customer_email

        //     // Call markPaidDb to update local database
        //     if (customerEmail) { // orgId is already checked above
        //         const amountPaid = Number(invoice.amount_due / 100); // Convert cents to dollars
        //         const dbUpdateResult = await markPaidDb(invoiceId, customerEmail, amountPaid, orgId || userId); // Pass orgId directly
        //         if (!dbUpdateResult.success) {
        //             console.warn(`Failed to update local database for invoice ${invoiceId}: ${dbUpdateResult.message}`);
        //             // Optionally, throw an error or handle this failure more robustly
        //         }
        //     } else {
        //         console.warn(`Skipping local DB update for invoice ${invoiceId}: Missing customer email.`);
        //     }

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

    const stripe = await getStripeInstance();
    try {
        const invoice = await stripe.invoices.voidInvoice(invoiceId);

        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

        // Call markPaidDb to update local database
        if (customerId) { // orgId is already checked above
            const amountPaid = Number(invoice.amount_due / 100); // Convert cents to dollars
            const dbUpdateResult = await markPaidDb(invoiceId, customerId, amountPaid, orgId || userId); // Pass orgId directly
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

export async function markQuote({ action, quoteId }: MarkQuoteProps) {
    const { isAdmin, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!userId) throw new Error("No user");

    const stripe = await getStripeInstance();
    try {
        let resultQuote: Stripe.Response<Stripe.Quote>;
        if (action === "accept") {
            resultQuote = await stripe.quotes.accept(quoteId);
        } else if (action === "cancel") {
            resultQuote = await stripe.quotes.cancel(quoteId);
        } else {
            throw new Error("Invalid action for quote operation.");
        }

        return {
            id: resultQuote.id,
            status: resultQuote.status,
        };
    } catch (e) {
        throw new Error(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
}




export async function hasStripeApiKeyAction(): Promise<boolean> {
    return await hasStripAPIKey();
}