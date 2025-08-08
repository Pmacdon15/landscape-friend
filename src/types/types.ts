//MARK: Client
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


export interface ClientListServiceProps {
  clientsPromise: Promise<PaginatedClients | null>;
  clientListPage: number;
  snow?: boolean;
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

//MARK: Clerk
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


export interface OrgMember {
    userId: string;
    userName: string | null;
}

export interface MutationData {
    clientId: number;
    pricePerCut: number;
}



export interface MapComponentProps {
    address: string[];
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

export interface Props {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

//MARL:Email
export interface HeaderEmailProps {
  text: string;
  senderName: string;
  companyName: string;
  title: string;
}

export interface InputFieldProps {
    id: string;
    name: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    step?: string;
    defaultValue?: number | string;
}

// interface MapComponentProps {
//     address: string;
// }


export interface CuttingPeriodSelectorProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
}
