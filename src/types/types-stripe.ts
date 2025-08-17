export interface FetchInvoicesResponse {
    invoices: StripeInvoice[];
    totalPages: number;
}

export interface StripeInvoice {
    id: string;
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
    status: string;
    total: number;
    lines: {
        data: StripeLineItem[];
    };
}

export interface StripeLineItem {
    id: string;
    object: string;
    amount: number;
    currency: string;
    description: string;
    quantity: number;
}
export interface APIKey {
    apk_key: string;
}
