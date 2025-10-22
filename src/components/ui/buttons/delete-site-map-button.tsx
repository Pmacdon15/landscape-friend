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
				isPending={isPending}
				variant={'remove-sitemap'}
				text={'Remove Image'}
				functionAction={() => mutate({ clientId, siteMapId })}
			/>
		</div>
	)
}
