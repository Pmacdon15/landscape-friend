import { fetchStripAPIKeyDb } from "@/lib/DB/stripe-db";
import { isOrgAdmin } from "@/lib/utils/clerk";
import { APIKey, FetchInvoicesResponse, StripeInvoice, FetchQuotesResponse, StripeQuote } from "@/types/stripe-types";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { fetchClientNamesByStripeIds } from "./clients-dal";

let stripe: Stripe | null = null;

export async function getStripeInstance(): Promise<Stripe> {

    const apiKeyResponse = await fetchStripeAPIKey();
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

export async function fetchStripeAPIKey(): Promise<APIKey | Error> {
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
                (invoice.customer_email && invoice.customer_email.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (invoice.id && invoice.id.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (invoice.number && invoice.number.toLowerCase().includes(lowerCaseSearchTerm))
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

        const strippedInvoices = paginatedInvoices.filter(invoice => invoice.id).map((invoice) => ({
            id: invoice.id!,
            object: invoice.object,
            amount_due: invoice.amount_due / 100,
            amount_paid: invoice.amount_paid / 100,
            amount_remaining: invoice.amount_remaining / 100,
            created: invoice.created,
            currency: invoice.currency,
            customer: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id || '',
            customer_email: invoice.customer_email || '',
            customer_name: invoice.customer_name || '',
            due_date: invoice.due_date || 0,
            hosted_invoice_url: invoice.hosted_invoice_url || '',
            invoice_pdf: invoice.invoice_pdf || '',
            number: invoice.number || '',
            status: invoice.status,
            total: invoice.total / 100,
            lines: {
                data: invoice.lines.data.map((lineItem) => ({
                    id: lineItem.id,
                    object: lineItem.object,
                    amount: lineItem.amount / 100,
                    currency: lineItem.currency,
                    description: lineItem.description,
                    quantity: lineItem.quantity || 0,
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

        const params: Stripe.QuoteListParams = {};
        if (typesOfQuotes && ['draft', 'open', 'accepted', 'canceled'].includes(typesOfQuotes)) {
            params.status = typesOfQuotes as 'draft' | 'open' | 'accepted' | 'canceled';
        }

        while (hasMore) {
            const quoteBatch: Stripe.ApiList<Stripe.Quote> = await stripe.quotes.list({
                ...params,
                starting_after: startingAfter,
                expand: ['data.line_items']
            });
            allQuotes = allQuotes.concat(quoteBatch.data);
            hasMore = quoteBatch.has_more;
            if (hasMore) {
                startingAfter = quoteBatch.data[quoteBatch.data.length - 1].id;
            }
        }

        const uniqueCustomerIds = [...new Set(allQuotes.map(quote => quote.customer).filter((customer): customer is string => typeof customer === 'string'))];
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

        let filteredQuotes = allQuotes;
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredQuotes = allQuotes.filter(quote => {
                const clientName = typeof quote.customer === 'string' ? clientNamesMap.get(quote.customer) : undefined;
                return (quote.description && quote.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (quote.id && quote.id.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (clientName && clientName.toLowerCase().includes(lowerCaseSearchTerm));
            });
        }

        const totalQuotes = filteredQuotes.length;
        const totalPages = Math.ceil(totalQuotes / pageSize);
        const offset = (page - 1) * pageSize;
        const paginatedQuotes = filteredQuotes.slice(offset, offset + pageSize);

        const strippedQuotes = paginatedQuotes.map((quote) => ({
    id: quote.id,
    object: quote.object,
    amount_total: quote.amount_total,
    customer: quote.customer,
    status: quote.status as string,
    expires_at: quote.expires_at,
    created: quote.created,
    client_name: typeof quote.customer === 'string' ? clientNamesMap.get(quote.customer) : undefined,
    lines: {
        data: (quote.line_items?.data || []).map((lineItem) => ({
            id: lineItem.id,
            object: lineItem.object,
            amount: ((lineItem.amount_subtotal / (lineItem.quantity || 1)) / 100),
            currency: lineItem.currency,
            description: lineItem.description,
            quantity: lineItem.quantity || 0,
        })),
    },
}));
        return { quotes: strippedQuotes as StripeQuote[], totalPages };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch quotes');
    }
}

export async function getInvoiceDAL(invoiceId: string): Promise<StripeInvoice> {
    const { isAdmin } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const stripe = await getStripeInstance();
    const invoice = await stripe.invoices.retrieve(invoiceId, {
        expand: ['lines.data'],
    });

    if (!invoice) {
        throw new Error('Invoice not found');
    }

    // Convert to plain object
    const plainInvoice: StripeInvoice = {
        id: invoice.id,
        object: invoice.object,
        amount_due: invoice.amount_due / 100,
        amount_paid: invoice.amount_paid / 100,
        amount_remaining: invoice.amount_remaining / 100,
        created: invoice.created,
        currency: invoice.currency,
        customer: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id || '',
        customer_email: invoice.customer_email || '',
        customer_name: invoice.customer_name || '',
        due_date: invoice.due_date || 0,
        hosted_invoice_url: invoice.hosted_invoice_url || '',
        invoice_pdf: invoice.invoice_pdf || '',
        number: invoice.number || '',
        status: invoice.status,
        total: invoice.total / 100,
        lines: {
            data: invoice.lines.data.map((lineItem) => ({
                id: lineItem.id,
                object: lineItem.object,
                // Use unit_amount if available, fallback to amount / quantity
                amount: ((lineItem.amount / (lineItem.quantity || 1)) / 100),
                currency: lineItem.currency,
                description: lineItem.description,
                quantity: lineItem.quantity || 0,
            })),
        },
    };
    console.log(JSON.stringify(plainInvoice, null, 2))
    return plainInvoice;
}

export async function getQuoteDAL(quoteId: string): Promise<StripeQuote> {
    const { isAdmin } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const stripe = await getStripeInstance();
    const quote = await stripe.quotes.retrieve(quoteId, {
        expand: ['line_items.data'],
    });

    if (!quote) {
        throw new Error('Quote not found');
    }

    const plainQuote: StripeQuote = {
        id: quote.id,
        object: quote.object,
        amount_total: quote.amount_total,
        customer: typeof quote.customer === 'string' ? quote.customer : quote.customer?.id || '',
        status: quote.status,
        expires_at: quote.expires_at,
        created: quote.created,
        lines: {
            data: (quote.line_items?.data || []).map((lineItem) => ({
                id: lineItem.id,
                object: lineItem.object,
                amount: ((lineItem.amount_subtotal / (lineItem.quantity || 1)) / 100),
                currency: lineItem.currency,
                description: lineItem.description,
                quantity: lineItem.quantity || 0,
            })),
        },
    };

    return plainQuote;
}
