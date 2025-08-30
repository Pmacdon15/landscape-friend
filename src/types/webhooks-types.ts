export interface InvoicePayload {
    client: {
        name: string;
    },
    invoice: {
        id: string | undefined;
        amount: string;
    }
}
