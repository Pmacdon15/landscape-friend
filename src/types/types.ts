export interface Client {
    id: number;
    full_name: string;
    phone_number: number;
    email_address: string;
    address: string;
    amount_owing: number;
    maintenance_week: number;
}

export interface Email {
    email_address: string;
}

export interface Account {
    id: number;
    client_id: number;
    current_balance: number;
}