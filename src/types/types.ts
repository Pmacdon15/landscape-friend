
export interface Client {
    id: number;
    full_name: string;
    phone_number: string;
    email_address: string;
    address: string;
    amount_owing: number;
    price_per_cut: number;
    cutting_schedules: CuttingSchedule[];
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

export interface SubscriptionItem {
    plan: {
        slug: string;
    };
    payer?: {
        organization_id: string;
    };
}

export interface UserCreatedEvent {
    id: string;
}

export interface UserDeletedEvent {
    id: string;
}
export interface OrganizationCreatedEvent {
    id: string;
}

export interface WebhookEvent {
    type: string;
    data: SubscriptionItem | OrganizationCreatedEvent;
}

export interface PaginatedClients {
    clients: Client[];
    totalPages: number;
    totalClients?: number;
}

export interface ClientResult {
    id: number;
    full_name: string;
    phone_number: string;
    email_address: string;
    address: string;
    amount_owing: number;
    price_per_cut: number;
    cutting_week: number;
    cutting_day: string;
    total_count: number;
}

export interface MutationData {
    clientId: number;
    pricePerCut: number;
}

export interface CuttingSchedule {
    cutting_week: number | null;
    cutting_day: string | null;
}

export interface CutStatusSelectorProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
