export type ServiceType = 'grass' | 'snow'

export interface ServiceHistoryItem {
	id: number
	service_id: number
	service_type: ServiceType
	service_date: string
	address_id: number
	address: string
	assigned_to_id: string
	assigned_to_name: string
	client_id: number
	client_name: string
	organization_id: string
	image_url: string | null
}

export interface ServiceHistoryResponse {
	services: ServiceHistoryItem[]
	totalPages: number
	totalServices: number
}

export interface ParsedServiceHistoryParams {
	page: number
	search: string
	serviceType: string
	assignedTo: string
	date: string
}
