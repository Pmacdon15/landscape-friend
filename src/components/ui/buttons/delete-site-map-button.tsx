'use client'
import { Alert } from '@/components/ui/alerts/alert'
import { useDeleteSiteMap } from '@/lib/mutations/mutations'
export default function DeleteSiteMapButton({
	clientId,
	siteMapId,
}: {
	clientId: number
	siteMapId: number
}) {
	const { mutate, isPending } = useDeleteSiteMap()
	return (
		<div className="absolute bottom-5 right-5">
			<Alert
				functionAction={() => mutate({ clientId, siteMapId })}
				isPending={isPending}
				text={'Remove Image'}
				variant={'remove-sitemap'}
			/>
		</div>
	)
}
