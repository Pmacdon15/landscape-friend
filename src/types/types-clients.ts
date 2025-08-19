import { OrgMember } from "./types-clerk";

export interface Client {
    id: number;
    full_name: string;
    phone_number: string;
    email_address: string;
    address: string;
    amount_owing: number;
    price_per_cut: number;
    price_per_month_snow: number;
    snow_client: boolean;
    cutting_schedules: CuttingSchedule[];
    assigned_to: string;
    images: string[];
    stripe_customer_id?: string;
}
export interface ClientListItemProps {
  client: Client;
  children?: React.ReactNode;
}


export interface ClientResult {
    id: number;
    full_name: string;
    phone_number: string;
    email_address: string;
    address: string;
    amount_owing: number;
    price_per_cut: number;
    price_per_month_snow: number;
    snow_client: boolean;
    cutting_week: number;
    cutting_day: string;
    total_count: number;
    assigned_to: string;
    images: string[];
}


export interface ClientListServiceProps {
    clientsPromise: Promise<PaginatedClients | null>;
    page: number;
    orgMembersPromise?: Promise<OrgMember[]>;
    isAdmin: boolean
}
export interface CuttingSchedule {
    cutting_week: number | null;
    cutting_day: string | null;
}

export interface CutStatusSelectorProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}



export interface PaginatedClients {
    clients: Client[];
    totalPages: number;
    totalClients?: number;
}


export interface Address {
    address: string
}
export interface Email {
    email_address: string;
}

export interface Account {
    id: number;
    client_id: number;
    current_balance: number;
}

export interface Price {
    price: number;
}

export interface NamesAndEmails {
    full_name: string;
    email_address: string;
}
