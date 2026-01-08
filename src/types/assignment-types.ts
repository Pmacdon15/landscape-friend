export type  ClientAssignment = {
	id: number
	user_id: string
	address_id: number
	priority: number
	service_type: 'grass' | 'snow'
}