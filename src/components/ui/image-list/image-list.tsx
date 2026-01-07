'use client'
import { MapPlus } from 'lucide-react'
import { Activity, useState } from 'react'
import type { Client, ClientResult } from '@/types/clients-types'
import ImageSelectorMain from '../image-selector/image-selector-main'
import AddSiteMap from './list-view/add-site-map'

export default function ImageList({
	isAdmin = false,
	client,
	page,
}: {
	isAdmin?: boolean
	client: ClientResult | Client
	page: number
}) {
	const [view, setView] = useState<string>('list')
	const [showSiteMap, setShowSiteMap] = useState(false)
	return (
		<div className="flex w-full flex-col">
			<button
				className="mx-auto flex gap-2 p-2 text-blue-500 text-md underline hover:cursor-pointer"
				onClick={() => setShowSiteMap(!showSiteMap)}
				type="button"
			>
				<MapPlus size={24} />
				{showSiteMap ? 'Hide site map' : 'Show site map'}
			</button>
			<Activity mode={showSiteMap ? 'visible' : 'hidden'}>
				{view === 'map' && (
					<div className="flex h-[300px] min-h-[300px] w-full flex-col gap-y-2 overflow-y-auto rounded-md bg-background p-2">
						<ImageSelectorMain
							address={client.address}
							client={client}
							setView={setView}
						/>
					</div>
				)}
				{/* {view === 'list' && client.images.length === 0 && isAdmin && (
					<AddSiteMap
						clientId={client.id}
						page={page}
						setView={setView}
					/>
				)} */}
				{/* {view === 'list' && client.images.length === 0 && !isAdmin && (
					<NonAdminPlaceHolder />
				)} */}
				{view === 'add' && (
					<AddSiteMap
						clientId={client.id}
						page={page}
						setView={setView}
					/>
				)}
				{/* {view === 'list' && client.images.length > 0 && (
					<ImageGallery
						client={client}
						isAdmin={isAdmin}
						page={page}
						setView={setView}
					/>
				)} */}
				{/* //TODO return site mape images  */}
			</Activity>
		</div>
	)
}
