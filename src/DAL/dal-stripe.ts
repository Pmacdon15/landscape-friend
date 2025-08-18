import { fetchStripAPIKeyDb } from "@/lib/DB/db-stripe";
import { isOrgAdmin } from "@/lib/webhooks";
import { APIKey, FetchInvoicesResponse, StripeInvoice, FetchQuotesResponse, StripeQuote } from "@/types/types-stripe";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

let stripe: Stripe | null = null;

async function getStripeInstance(): Promise<Stripe> {

    const apiKeyResponse = await fetchStripAPIKey();
    if (apiKeyResponse instanceof Error) {
        throw new Error('Stripe secret key not configured.');
    }

    const apiKey = apiKeyResponse.apk_key;
    if (!apiKey) {
        throw new Error('Stripe secret key not configured.');
    }

    stripe = new Stripe(apiKey);
    return stripe;
}

export async function fetchStripAPIKey(): Promise<APIKey | Error> {
    const { orgId, userId } = await auth.protect();
    try {
        const result = await fetchStripAPIKeyDb(orgId || userId);
        if (!result || !result.api_key) return new Error('API key not found');
        return { apk_key: result.api_key };
    } catch (e) {
        if (e instanceof Error)
            return e;
        return new Error('An unknown error occurred');
    }
}

export async function hasStripAPIKey(): Promise<boolean> {
    const { orgId, userId } = await auth.protect();
    try {
        const result = await fetchStripAPIKeyDb(orgId || userId);
        if (!result || !result.api_key) return false;
        return true;
    } catch (e) {
        if (e instanceof Error)
            return false;
        return false;
    }
}


export async function fetchInvoices(typesOfInvoices: string, page: number, searchTerm: string): Promise<FetchInvoicesResponse> {
    const { isAdmin } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const stripe = await getStripeInstance();
    const pageSize = Number(process.env.PAGE_SIZE) || 10;

    try {
        let allInvoices: Stripe.Invoice[] = [];
        let hasMore = true;
        let startingAfter: string | undefined = undefined;

        const params: Stripe.InvoiceListParams = { limit: 100 };
        if (typesOfInvoices && ['draft', 'paid', 'open'].includes(typesOfInvoices)) {
            params.status = typesOfInvoices as 'draft' | 'paid' | 'open';
        }

        while (hasMore) {
            const invoiceBatch: Stripe.ApiList<Stripe.Invoice> = await stripe.invoices.list({ ...params, starting_after: startingAfter });
            allInvoices = allInvoices.concat(invoiceBatch.data);
            hasMore = invoiceBatch.has_more;
            if (hasMore) {
                startingAfter = invoiceBatch.data[invoiceBatch.data.length - 1].id;
            }
        }

        let filteredInvoices = allInvoices;
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredInvoices = allInvoices.filter(invoice =>
                (invoice.customer_name && invoice.customer_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (invoice.customer_email && invoice.customer_email.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        const totalInvoices = filteredInvoices.length;
        const totalPages = Math.ceil(totalInvoices / pageSize);
        const offset = (page - 1) * pageSize;
        const paginatedInvoices = filteredInvoices.slice(offset, offset + pageSize);

        const strippedInvoices = paginatedInvoices.map((invoice) => ({
            id: invoice.id,
            object: invoice.object,
            amount_due: invoice.amount_due,
            amount_paid: invoice.amount_paid,
            amount_remaining: invoice.amount_remaining,
            created: invoice.created,
            currency: invoice.currency,
            customer: invoice.customer,
            customer_email: invoice.customer_email,
            customer_name: invoice.customer_name,
            due_date: invoice.due_date,
            hosted_invoice_url: invoice.hosted_invoice_url,
            invoice_pdf: invoice.invoice_pdf,
            number: invoice.number,
            status: invoice.status,
            total: invoice.total,
            lines: {
                data: invoice.lines.data.map((lineItem) => ({
                    id: lineItem.id,
                })),
            },
        }));

        return { invoices: strippedInvoices as StripeInvoice[], totalPages };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch invoices');
    }
}


export async function fetchQuotes(typesOfQuotes: string, page: number): Promise<FetchQuotesResponse> {
    const { isAdmin } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const stripe = await getStripeInstance();
    const pageSize = Number(process.env.PAGE_SIZE) || 10;

    try {
        let allQuotes: Stripe.Quote[] = [];
        let hasMore = true;
        let startingAfter: string | undefined = undefined;

        const params: Stripe.QuoteListParams = { limit: 100 };
        if (typesOfQuotes && ['draft', 'open', 'accepted', 'canceled'].includes(typesOfQuotes)) {
            params.status = typesOfQuotes as 'draft' | 'open' | 'accepted' | 'canceled';
        }

        while (hasMore) {
            const quoteBatch: Stripe.ApiList<Stripe.Quote> = await stripe.quotes.list({ ...params, starting_after: startingAfter });
            allQuotes = allQuotes.concat(quoteBatch.data);
            hasMore = quoteBatch.has_more;
            if (hasMore) {
                startingAfter = quoteBatch.data[quoteBatch.data.length - 1].id;
            }
        }

        const totalQuotes = allQuotes.length;
        const totalPages = Math.ceil(totalQuotes / pageSize);
        const offset = (page - 1) * pageSize;
        const paginatedQuotes = allQuotes.slice(offset, offset + pageSize);

        // const quotesWithPdf = await Promise.all(paginatedQuotes.map(async (quote) => {
        //     const retrievedQuote = await stripe.quotes.pdf(quote.id);
        //     return retrievedQuote
        // }));

        // console.log("quotesWithPdf: ", quotesWithPdf)
        const strippedQuotes = paginatedQuotes.map((quote) => ({
            id: quote.id,
            object: quote.object,
            amount_total: quote.amount_total,
            customer: quote.customer,
            status: quote.status,
            expires_at: quote.expires_at,
            total_details: quote.total_details,
            application_fee_amount: quote.application_fee_amount,
            collection_method: quote.collection_method,
            description: quote.description,
            invoice: quote.invoice,
            from_quote: quote.from_quote,
            line_items: quote.line_items,
            transfer_data: quote.transfer_data,
            created: quote.created,
        }));

        return { quotes: strippedQuotes as StripeQuote[], totalPages };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch quotes');
    }
}