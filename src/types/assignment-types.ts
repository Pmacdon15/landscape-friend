export type  ClientAssignment = {
	id: number
	user_id: string
	address_id: number
	priority: number
	service_type: 'grass' | 'snow'
}

export type ScheduledClient = {
	id: number
	full_name: string
	phone_number: string | null
	email_address: string | null
	address: string
	assignment_id: number
	user_id: string
	priority: number
}