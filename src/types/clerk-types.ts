//MARK: Clerk
export interface SubscriptionItem {
	plan: {
		slug: string
	}
	payer?: {
		organization_id: string
	}
}

export interface UserCreatedEvent {
	id: string
	first_name: string | null
	last_name: string | null
	username: string | null
	email_addresses: { email_address: string }[]
}

export interface UserDeletedEvent {
	id: string
	userId: string
}
export interface OrganizationCreatedEvent {
	id: string
	name: string
}

export interface WebhookEvent {
	type: string
	data:
		| SubscriptionItem
		| OrganizationCreatedEvent
		| UserCreatedEvent
		| UserDeletedEvent
}

export interface OrgMember {
	userId: string
	userName: string | null
	role?: string
}
