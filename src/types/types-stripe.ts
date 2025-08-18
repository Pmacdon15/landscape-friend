import Stripe from 'stripe';

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

export interface FetchQuotesResponse {
    quotes: StripeQuote[];
    totalPages: number;
}

export interface StripeQuote {
  id: string;
  object: 'quote';
  amount_total: number | null;
  customer: string | null;
  status: Stripe.Quote.Status;
  expires_at: number | null;
  pdf: string | null;
  total_details: Stripe.Quote.TotalDetails | null;
  application_fee_amount: number | null;
  collection_method: Stripe.Quote.CollectionMethod | null;
  created: number;
  description: string | null;
  invoice: string | null;
  from_quote: Stripe.Quote.FromQuote | null;
  line_items?: any; // We'll address the type issue below
  transfer_data: Stripe.Quote.TransferData | null;
}
