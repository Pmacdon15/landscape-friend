import { fetchStripAPIKeyDb } from "@/lib/DB/db-stripe";
import { isOrgAdmin } from "@/lib/server-funtions/clerk";
import { createStripeWebhook } from "@/lib/server-funtions/stripe-utils";
import { APIKey, FetchInvoicesResponse, StripeInvoice, FetchQuotesResponse, StripeQuote } from "@/types/types-stripe";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { fetchClientNamesByStripeIds } from "./clients-dal";

let stripe: Stripe | null = null;

export async function getStripeInstance(): Promise<Stripe> {

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
        if (typesOfInvoices && ['draft', 'paid', 'open', 'void'].includes(typesOfInvoices)) {
            params.status = typesOfInvoices as 'draft' | 'paid' | 'open' | 'void';
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

        const uniqueCustomerIds = [...new Set(allInvoices.map(invoice => invoice.customer).filter((customer): customer is string => typeof customer === 'string'))];

        const clientNamesResult = await fetchClientNamesByStripeIds(uniqueCustomerIds);

        if (clientNamesResult instanceof Error) {
            throw clientNamesResult;
        }

        const clientNamesMap = new Map<string, string>();
        clientNamesResult.forEach(client => {
            if (client.stripe_customer_id && client.full_name) {
                clientNamesMap.set(client.stripe_customer_id, client.full_name);
            }
        });

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
            client_name: typeof invoice.customer === 'string' ? clientNamesMap.get(invoice.customer) : undefined,
        }));

        return { invoices: strippedInvoices as StripeInvoice[], totalPages };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch invoices');
    }
}


export async function fetchQuotes(typesOfQuotes: string, page: number, searchTerm: string): Promise<FetchQuotesResponse> {
    const { isAdmin } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const stripe = await getStripeInstance();
    const pageSize = Number(process.env.PAGE_SIZE) || 10;

    try {
        let allQuotes: Stripe.Quote[] = [];
        let hasMore = true;
        let startingAfter: string | undefined = undefined;

        const params: Stripe.QuoteListParams = { limit: 200 };
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

        let filteredQuotes = allQuotes;
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredQuotes = allQuotes.filter(quote =>
                (quote.description && quote.description.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        const totalQuotes = filteredQuotes.length;
        const totalPages = Math.ceil(totalQuotes / pageSize);
        const offset = (page - 1) * pageSize;
        const paginatedQuotes = filteredQuotes.slice(offset, offset + pageSize);

        // const quotesWithPdf = await Promise.all(paginatedQuotes.map(async (quote) => {
        //     const retrievedQuote = await stripe.quotes.pdf(quote.id);
        //     return retrievedQuote
        // }));

        // console.log("quotesWithPdf: ", quotesWithPdf)
        const uniqueCustomerIds = [...new Set(allQuotes.map(quote => quote.customer).filter((customer): customer is string => typeof customer === 'string'))];
        // console.log("Unique Customer IDs from Stripe:", uniqueCustomerIds);

        const clientNamesResult = await fetchClientNamesByStripeIds(uniqueCustomerIds);
        // console.log("Client Names Result from DB:", clientNamesResult);

        if (clientNamesResult instanceof Error) {
            throw clientNamesResult;
        }

        const clientNamesMap = new Map<string, string>();
        clientNamesResult.forEach(client => {
            if (client.stripe_customer_id && client.full_name) {
                clientNamesMap.set(client.stripe_customer_id, client.full_name);
            }
        });
        // console.log("Client Names Map:", clientNamesMap);

        const strippedQuotes = paginatedQuotes.map((quote) => ({
            id: quote.id,
            object: quote.object,
            amount_total: quote.amount_total,
            customer: quote.customer,
            status: quote.status as string,
            expires_at: quote.expires_at,
            created: quote.created,
            client_name: typeof quote.customer === 'string' ? clientNamesMap.get(quote.customer) : undefined,
        }));

        return { quotes: strippedQuotes as StripeQuote[], totalPages };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch quotes');
    }
}

// export async function createOrgWebhook() {
//     const { isAdmin, orgId, userId } = await isOrgAdmin();

//     if (!orgId && !userId) throw new Error("Must be logged in.");
//     if (!isAdmin) throw new Error("Only admins can create webhooks.");

//     const apiKeyResponse = await fetchStripAPIKeyDb(orgId || userId!);
//     if (!apiKeyResponse || !apiKeyResponse.api_key) {
//         throw new Error("Stripe API key not found.");
//     }

//     await createStripeWebhook(apiKeyResponse.api_key, orgId || userId!);
// }