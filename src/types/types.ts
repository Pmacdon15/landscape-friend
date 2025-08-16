//MARK: Client
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
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    email_addresses: { email_address: string; }[];
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
    data: SubscriptionItem | OrganizationCreatedEvent | UserCreatedEvent | UserDeletedEvent;
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
    |
    {
        coordinates: Location;
        zoom: number;
        error: boolean;
    }
    |
    {
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

export interface MaterialField {
    id: string;
    materialType?: string;
    materialCostPerUnit?: number;
    materialUnits?: number;
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

export type SearchParams = Record<string, string | string[] | number | undefined>;

export interface ParsedClientListParams {
  page: number;
  searchTerm: string;
  serviceDate: Date;
  searchTermIsServiced: boolean;
  searchTermCuttingWeek: number;
  searchTermCuttingDay: string;
  searchTermAssignedTo: string;
  searchTermStatus: string;
}