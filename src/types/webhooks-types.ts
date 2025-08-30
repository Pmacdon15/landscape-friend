export interface InvoicePayload {
    client: {
        name: string;
    },
    invoice: {
        invoiceId: string | undefined;
        amount: string;
    }
}
