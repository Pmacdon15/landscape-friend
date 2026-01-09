import type { ScheduledClient } from './assignment-types'
import type { Client } from './clients-types'

export interface CuttingPeriodSelectorProps {
	label: string
	options: { value: string; label: string }[]
	value: string
	handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
	name: string
}

export interface MaterialField {
	id: string
	materialType?: string
	materialCostPerUnit?: number
	materialUnits?: number
}

export interface ImageGalleryProps {
	isAdmin: boolean
	client: Client | ScheduledClient
	setView: (view: string) => void
	page: number
}
