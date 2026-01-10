'use client'
import { use } from 'react'
import { Alert } from '@/components/ui/alerts/alert'
import { useDeleteSiteMap } from '@/lib/mutations/mutations'
import type { ClientSiteMapImages } from '@/types/site-maps-types'
export default function DeleteSiteMapButton({
	siteMap,
	pagePromise,
}: {
	siteMap: ClientSiteMapImages
	pagePromise: Promise<number>
}) {
	const page = use(pagePromise)
	const { mutate, isPending } = useDeleteSiteMap(page)
	return (
		<div className="absolute right-5 bottom-5">
			<Alert
				functionAction={() => mutate({ siteMapId: siteMap.id })}
				isPending={isPending}
				text={'Remove Image'}
				variant={'remove-sitemap'}
			/>
		</div>
	)
}
