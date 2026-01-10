'use client'
import { MapPlus } from 'lucide-react'
import { Activity, use, useState } from 'react'
import type { ClientSiteMapImages } from '@/types/site-maps-types'
import ImageSelectorMain from '../image-selector/image-selector-main'
import ImageGallery from './image-gallery'
import AddSiteMap from './list-view/add-site-map'
import NonAdminPlaceHolder from './list-view/non-admin-placeholder'

export default function SiteMapImageList({
	// isAdmin = false,
	addressId,
	pagePromise,
	isAdminPromise,
	siteMaps,
}: {
	// isAdmin?: boolean
	addressId: number
	pagePromise: Promise<number>
	isAdminPromise: Promise<{ isAdmin: boolean }>
	siteMaps: ClientSiteMapImages[]
}) {
	const isAdmin = use(isAdminPromise)
	const [view, setView] = useState<string>('list')
	const [showSiteMap, setShowSiteMap] = useState(false)
	// console.log('SiteMaps: ', siteMaps)
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
				{view === 'list' && siteMaps.length < 1 && (
					<AddSiteMap
						addressId={addressId}
						pagePromise={pagePromise}
						setView={setView}
					/>
				)}

				{view === 'map' && (
					<div className="flex h-75 min-h-75 w-full flex-col gap-y-2 overflow-y-auto rounded-md bg-background p-2">
						<ImageSelectorMain
							address={siteMaps[0].address}
							addressId={addressId}
							setView={setView}
						/>
					</div>
				)}

				{view === 'list' && siteMaps && !isAdmin.isAdmin && (
					<NonAdminPlaceHolder />
				)}
				{view === 'add' && siteMaps.length > 0 && (
					<AddSiteMap
						addressId={addressId}
						pagePromise={pagePromise}
						setView={setView}
					/>
				)}
				{view === 'list' && siteMaps.length > 0 && (
					<ImageGallery
						isAdmin={isAdmin.isAdmin}
						pagePromise={pagePromise}
						setView={setView}
						siteMaps={siteMaps}
					/>
				)}
			</Activity>
		</div>
	)
}
