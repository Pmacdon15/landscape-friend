import type { ClientAssignment } from '@/types/assignment-types'
import type { OrgMember } from './clerk-types'
import type { ParsedClientListParams } from './params-types'
import type { ClientCuttingSchedule } from './schedules-types'
import type { ClientSiteMapImages } from './site-maps-types'

export interface Image {
	id: number
	url: string
}

export interface Assignment {
	id: number
	user_id: string
	name: string
	priority: number
}

export interface CustomerName {
	stripe_customer_id: string
	full_name?: string
}
// export interface Client {
// 	id: number
// 	full_name: string
// 	phone_number: number | undefined
// 	email_address?: string
// 	address: string
// 	amount_owing: number
// 	cutting_week: number
// 	cutting_day: string
// 	cutting_schedules: CuttingSchedule[]
// 	snow_assigned_to: string
// 	grass_assigned_to: string
// 	images: Image[]
// 	stripe_customer_id?: string
// }

// export interface EditClientInfo {
// 	id: number
// 	full_name: string
// 	phone_number?: string
// 	email_address?: string
// 	address: string
// 	amount_owing: number
// 	cutting_week: number
// 	cutting_day: string
// 	cutting_schedules: CuttingSchedule[]
// 	snow_assigned_to: string
// 	grass_assigned_to: string
// 	images: Image[]
// 	stripe_customer_id?: string
// }
// export interface ClientListItemProps {
//     client: Client;
//     children?: React.ReactNode;
// }

export interface ClientInfoList {
	id: number
	full_name: string
	phone_number: string
	email_address: string
	addresses: string[]
}

export interface ClientResult {
	id: number
	full_name: string
	address: string
	amount_owing: number
	price_per_month_grass: number
	price_per_month_snow: number
	cutting_week: number
	cutting_day: string
	total_count: number
	snow_assignments: Assignment[] | null
	grass_assignments: Assignment[] | null
	images: Image[]
}

export interface ClientResultListClientPage {
	id: number
	full_name: string
	address: string
	amount_owing: number
	phone_number: number
	email_address: string
	price_per_month_grass: number
	price_per_month_snow: number
	cutting_week: number
	cutting_day: string
	total_count: number
	snow_assignments: Assignment[] | null
	grass_assignments: Assignment[] | null
	images: Image[]
}

export interface ClientListServiceProps {
	// Optional promise to check admin status
	isAdminPromise?: Promise<{ isAdmin: boolean }>

	// Promise that resolves to clients, addresses, and accounts, with pagination info
	clientsPromise: Promise<{
		clients: Client[]
		addresses: ClientAddress[]
		accounts: ClientAccount[]
		assignments: ClientAssignment[]
		schedules: ClientCuttingSchedule[]
		siteMaps: ClientSiteMapImages[]
		totalPages: number
	} | null>

	// Optional promise for organization members
	orgMembersPromise: Promise<OrgMember[] | { errorMessage: string }>

	// Promise for search/filter parameters
	searchParamsPromise: Promise<ParsedClientListParams>
}
// export interface CuttingSchedule {
// 	cutting_week: number | null
// 	cutting_day: string | null
// }

export interface CutStatusSelectorProps {
	value: string
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export interface PaginatedClients {
	clients: Client[]
	totalPages: number
	totalClients?: number
}
export interface ClientsReturn {
	clients: ClientResult[]
	totalClients?: number
}

export interface Address {
	address: string
}
export interface Email {
	email_address: string
}

// export interface Account {
// 	id: number
// 	client_id: number
// 	current_balance: number
// }

export interface Price {
	price: number
}

export interface NamesAndEmails {
	full_name: string
	email_address: string
}

// export interface ClientAddress {
//     id: number;
//     client_id: number;
//     address: string;
// }

// Interface for Client (from your clients table)
export interface Client {
	id: number
	full_name: string
	phone_number: string | null
	email_address: string | null
	organization_id: string
	stripe_customer_id: string | null
}

// Interface for Account (from your accounts table)
export interface ClientAccount {
	id: number
	client_id: number
	current_balance: number
}

// Interface for ClientAddress (from your client_addresses table)
export interface ClientAddress {
	id: number
	client_id: number
	address: string
}
