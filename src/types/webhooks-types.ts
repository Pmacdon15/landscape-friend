interface InvoicePayload {
    client: {
        name: string;
    },
    invoice: {
        id: string | undefined;
        amount: string;
    }
}

interface QuotePayload {
    quote: {
        amount: string;
        id: string;

    }
    client: {
        name: string;
    }
}

interface ClientPayload {

    client: {
        name: string;
        encodedName: string
    }

}

interface CutsPayload {
    cuts: {
        amount: number;
    };
    date: string;
}


export type PayloadType = InvoicePayload | QuotePayload | ClientPayload | CutsPayload;