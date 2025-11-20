import type { Client, ClientResult } from './clients-types'

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
	client: Client | ClientResult
	setView: (view: string) => void
}
