'use client'
import { useState } from 'react'
import type { Client, ClientResult } from '@/types/clients-types'
import ImageSelectorMain from '../image-selector/image-selector-main'
import ImageGallery from './image-gallery'
import AddSiteMap from './list-view/add-site-map'
import NonAdminPlaceHolder from './list-view/non-admin-placeholder'

export default function ImageList({
	isAdmin = false,
	client,
}: {
	isAdmin?: boolean
	client: ClientResult | Client
}) {
	const [view, setView] = useState<string>('list')

	return (
		<>
			{view === 'map' && (
				<div className="flex h-[300px] min-h-[300px] w-full flex-col gap-y-2 overflow-y-auto rounded-md bg-background p-2">
					<ImageSelectorMain
						address={client.address}
						client={client}
						setView={setView}
					/>
				</div>
			)}
			{view === 'list' && client.images.length === 0 && isAdmin && (
				<AddSiteMap clientId={client.id} setView={setView} />
			)}
			{view === 'list' && client.images.length === 0 && !isAdmin && (
				<NonAdminPlaceHolder />
			)}
			{view === 'add' && (
				<AddSiteMap clientId={client.id} setView={setView} />
			)}
			{view === 'list' && client.images.length > 0 && (
				<ImageGallery
					client={client}
					isAdmin={isAdmin}
					setView={setView}
				/>
			)}
		</>
	)
}
