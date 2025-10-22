import { Client } from './clients-types'

export interface ImageListViewProps {
	client: Client
	setView: (view: string) => void
	previewSrc: string | null
	setPreviewSrc: (src: string | null) => void
}
