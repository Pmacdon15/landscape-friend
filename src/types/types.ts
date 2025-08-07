
export interface Client {
    id: number;
    full_name: string;
    phone_number: string;
    email_address: string;
    address: string;
    amount_owing: number;
    price_per_cut: number;
    snow_client: boolean;
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
    name: string;
}

export interface UserDeletedEvent {
    id: string;
}
export interface OrganizationCreatedEvent {
    id: string;
    name: string;
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
    snow_client: boolean;
    cutting_week: number;
    cutting_day: string;
    total_count: number;
}

export interface OrgMember {
    id: string;
    role: string;
    publicMetadata: Record<string, unknown>;
    privateMetadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    organization: {
        id: string;
        name: string;
    };
    publicUserData: {
        userId: string;
        firstName: string | null;
        lastName: string | null;
        fullName?: string; // Add fullName field
    };
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


export interface MapComponentProps {
    addresses: string[];
}

export interface Location {
    lat: number;
    lng: number;
}

export interface GeocodeResult {
    coordinates: Location;
    error?: string;
    zoom?: number;
}

// Match the actual return type of fetchGeocode based on error messages
export type FetchGeocodeResult =
    | {
        coordinates: Location;
        zoom: number;
        error: boolean;
    }
    | {
        error: string | boolean;
        coordinates?: never;
        zoom?: never;
    };

export interface NamesAndEmails {
    full_name: string;
    email_address: string;
}

export interface APIKey {
    apk_key: string;
}