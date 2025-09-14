import { fetchStripAPIKeyDb } from "@/lib/DB/stripe-db";
import { isOrgAdmin } from "@/lib/utils/clerk";
import { APIKey, FetchInvoicesResponse, StripeInvoice, FetchQuotesResponse, StripeQuote, FetchSubscriptionsResponse } from "@/types/stripe-types";
import { Subscription } from "@/types/subscription-types";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { fetchClientNamesByStripeIds } from "./clients-dal";


let stripe: Stripe | null = null;

export async function getStripeInstance(): Promise<Stripe | null> {

    const apiKeyResponse = await fetchStripeAPIKey();
    if (apiKeyResponse instanceof Error) {
        return null;
    }

    const apiKey = apiKeyResponse.apk_key;
    if (!apiKey) {
        return null;
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

export async function fetchProducts(): Promise<Stripe.Product[]> {
    await auth.protect();
    const stripe = await getStripeInstance();
    if (!stripe) {
        throw new Error('Failed to initialize Stripe instance');
    }

    try {
        let products: Stripe.Product[] = [];
        let hasMore = true;
        let startingAfter: string | undefined = undefined;

        while (hasMore) {
            const response: Stripe.ApiList<Stripe.Product> = await stripe.products.list({
                active: true,
                limit: 100,
                starting_after: startingAfter,
            });

            products = products.concat(response.data);
            hasMore = response.has_more;
            if (hasMore) {
                startingAfter = response.data[response.data.length - 1].id;
            }
        }

        const filteredProducts = products.filter(product => !product.metadata.serviceType);

        return filteredProducts;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unknown error occurred');
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
    if (!stripe) throw new Error('Failed to get Stripe instance');
    const pageSize = Number(process.env.PAGE_SIZE) || 10;

    try {
        let allInvoices: Stripe.Invoice[] = [];
        let hasMore = true;
        let startingAfter: string | undefined = undefined;

        const params: Stripe.InvoiceListParams = {};
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

            filteredInvoices = allInvoices.filter(invoice => {
                if (
                    (invoice.customer_name && invoice.customer_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (invoice.customer_email && invoice.customer_email.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (invoice.id && invoice.id.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (invoice.number && invoice.number.toLowerCase().includes(lowerCaseSearchTerm))
                ) {
                    return true;
                }

                if (!isNaN(parseFloat(lowerCaseSearchTerm))) {
                    if (invoice.total !== null && (invoice.total / 100).toString().startsWith(lowerCaseSearchTerm)) {
                        return true;
                    }
                    if (invoice.amount_due !== null && (invoice.amount_due / 100).toString().startsWith(lowerCaseSearchTerm)) {
                        return true;
                    }
                }

                return false;
            });
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
    if (!stripe) throw new Error('Failed to get Stripe instance');
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
                expand: ['data.line_items', 'data.customer']
            });
            allQuotes = allQuotes.concat(quoteBatch.data);
            hasMore = quoteBatch.has_more;
            if (hasMore) {
                startingAfter = quoteBatch.data[quoteBatch.data.length - 1].id;
            }
        }

        const uniqueCustomerIds = [
            ...new Set(
                allQuotes
                    .map(quote => (typeof quote.customer === "string" ? quote.customer : quote.customer?.id))
                    .filter((id): id is string => Boolean(id)) // type guard ensures it's string
            ),
        ];

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
                const customerId = typeof quote.customer === 'string' ? quote.customer : quote.customer?.id;
                const clientName = customerId ? clientNamesMap.get(customerId) : undefined;
                const stripeCustomerName = typeof quote.customer === 'object' && quote.customer && 'name' in quote.customer ? quote.customer.name : undefined;

                const amountTotalStr = (quote.amount_total / 100).toString(); // convert cents → dollars
                const lineItemAmounts = (quote.line_items?.data || [])
                    .map(li => ((li.amount_subtotal / (li.quantity || 1)) / 100).toString());

                return (
                    (quote.description && quote.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (quote.id && quote.id.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (clientName && clientName.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (stripeCustomerName && stripeCustomerName.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    amountTotalStr.includes(lowerCaseSearchTerm) ||
                    lineItemAmounts.some(amount => amount.includes(lowerCaseSearchTerm))
                );
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
            metadata: quote.metadata,
            customer_name: typeof quote.customer === 'object' && quote.customer !== null && 'name' in quote.customer ? quote.customer.name : undefined,
            customer_email: typeof quote.customer === 'object' && quote.customer !== null && 'email' in quote.customer ? quote.customer.email : undefined,
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
    if (!stripe) throw new Error('Failed to get Stripe instance');
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
    if (!stripe) throw new Error('Failed to get Stripe instance');
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
        metadata: quote.metadata,
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

export async function fetchSubscriptions(typesOfSubscriptions: string, page: number, searchTerm: string): Promise<FetchSubscriptionsResponse> {
    const { isAdmin } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const stripe = await getStripeInstance();
    if (!stripe) throw new Error('Failed to get Stripe instance');
    const pageSize = Number(process.env.PAGE_SIZE) || 10;

    try {
        let allSubscriptions: Stripe.Subscription[] = [];
        let hasMore = true;
        let startingAfter: string | undefined = undefined;

        const params: Stripe.SubscriptionListParams = { expand: ['data.customer'] };
        if (typesOfSubscriptions && ['active', 'canceled', 'incomplete'].includes(typesOfSubscriptions)) {
            params.status = typesOfSubscriptions as 'active' | 'canceled' | 'incomplete';
        }

        while (hasMore) {
            const subscriptionBatch: Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list({ ...params, starting_after: startingAfter });
            allSubscriptions = allSubscriptions.concat(subscriptionBatch.data);
            hasMore = subscriptionBatch.has_more;
            if (hasMore) {
                startingAfter = subscriptionBatch.data[subscriptionBatch.data.length - 1].id;
            }
            console.log("Sub: ", subscriptionBatch)
        }

        let filteredSubscriptions = allSubscriptions;
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredSubscriptions = allSubscriptions.filter(subscription => {
                const customer = subscription.customer as Stripe.Customer;
                return (customer.name && customer.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (customer.email && customer.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (subscription.id && subscription.id.toLowerCase().includes(lowerCaseSearchTerm))
            }
            );
        }

        const totalSubscriptions = filteredSubscriptions.length;
        const totalPages = Math.ceil(totalSubscriptions / pageSize);
        const offset = (page - 1) * pageSize;
        const paginatedSubscriptions = filteredSubscriptions.slice(offset, offset + pageSize);

        const customerIds = paginatedSubscriptions.map(subscription => (subscription.customer as Stripe.Customer).id);
        const clientNamesResult = await fetchClientNamesByStripeIds(customerIds);

        if (clientNamesResult instanceof Error) {
            throw clientNamesResult;
        }


        const uniqueProductIds = new Set<string>();
        allSubscriptions.forEach(subscription => {
            subscription.items.data.forEach(item => {
                if (typeof item.price.product === 'string') {
                    uniqueProductIds.add(item.price.product);
                }
            });
        });

        const productNamesMap = new Map<string, string>();
        for (const productId of uniqueProductIds) {
            try {
                const product = await stripe.products.retrieve(productId);
                productNamesMap.set(productId, product.name);
            } catch (error) {
                console.error(`Error fetching product ${productId}:`, error);
                productNamesMap.set(productId, 'Unknown Product'); // Fallback
            }
        }

        const strippedSubscriptions = await Promise.all(paginatedSubscriptions.map(async (subscription) => {
            let schedule = null;
            if (subscription.schedule) {
                try {
                    const scheduleId = typeof subscription.schedule === 'string' ? subscription.schedule : subscription.schedule.id;
                    schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);
                    schedule = {
                        id: schedule.id,
                        status: schedule.status,
                        phases: schedule.phases.map(phase => ({
                            start_date: phase.start_date,
                            end_date: phase.end_date,
                        })),
                    };
                } catch (error) {
                    console.error(`Error retrieving subscription schedule for ${subscription.id}:`, error);
                }
            }

            return {
                id: subscription.id,
                object: subscription.object,
                status: subscription.status,
                start_date: subscription.start_date,
                cancel_at_period_end: subscription.cancel_at_period_end,
                canceled_at: subscription.canceled_at,
                created: subscription.created,
                subscription_schedule: schedule,
                customer: {
                    id: (subscription.customer as Stripe.Customer).id,
                    name: (subscription.customer as Stripe.Customer).name || undefined,
                    email: (subscription.customer as Stripe.Customer).email || undefined,
                },
                items: {
                    data: subscription.items.data.map((item) => ({
                        id: item.id,
                        object: item.object,
                        quantity: item.quantity || 0,
                        price: {
                            id: item.price.id,
                            object: item.price.object,
                            active: item.price.active,
                            currency: item.price.currency,
                            product: productNamesMap.get(item.price.product as string) || 'Unknown Product',
                            unit_amount: item.price.unit_amount || 0,
                        }
                    }))
                }
            };
        }));

        return { subscriptions: strippedSubscriptions as Subscription[], totalPages };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch subscriptions');
    }
}
