import { Subscription } from "./subscription-types";

export interface FetchSubscriptionsResponse {
    subscriptions: Subscription[];
    totalPages: number;
}

export interface FetchInvoicesResponse {
    invoices: StripeInvoice[];
    totalPages: number;
}


export interface StripeInvoice {
    id: string | undefined;
    object: string;
    amount_due: number;
    amount_paid: number;
    amount_remaining: number;
    created: number;
    currency: string;
    customer: string;
    customer_email: string;
    customer_name: string;
    due_date: number;
    hosted_invoice_url: string;
    invoice_pdf: string;
    number: string;
    status: string | null;
    total: number;
    lines: {
        data: StripeLineItem[];
    };
    client_name?: string;
}

export interface StripeLineItem {
    id: string;
    object: string;
    amount: number;
    currency: string;
    description: string | null;
    quantity: number;
    unit_amount?: number;
}
export interface APIKey {
    apk_key: string;
}

export type EditStripeForm = StripeInvoice | StripeQuote;
export interface FetchQuotesResponse {
    quotes: StripeQuote[];
    totalPages: number;   
}

export interface InvoiceId {
    invoiceId: string;
}


export interface InvoicePayload {
    invoice: {
        amount: string;
        id: string;

    }
    client: {
        name: string;
    }
}
export interface StripeQuote {
    id: string;
    object: 'quote';
    amount_total: number | null;
    customer: string | null;
    status: string;
    expires_at: number | null;
    created: number;
    metadata: Record<string, string | number>;
    customer_name?: string;
    customer_email?: string;
    client_name?: string;
    lines?: {
        data: StripeLineItem[];
    };

}


export interface MarkQuoteProps {
    action: "accept" | "cancel" | "send" | "edit";
    quoteId: string;
}
