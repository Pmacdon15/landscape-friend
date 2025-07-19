export interface Client {
    id: number;
    full_name: string;
    email_address: string;
    address: string;
    amount_owing: number;
    maintenance_week: number;
}

export interface Email {
    email_address: string;
}

