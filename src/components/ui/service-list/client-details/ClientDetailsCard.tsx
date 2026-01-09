import { Suspense } from 'react'
import type { ScheduledClient } from '@/types/assignment-types'
import type { ClientSiteMapImages } from '@/types/site-maps-types'
import SiteMapImageList from '../../image-list/site-map-image-list'
import ClientAddress from './ClientAddress'
import ClientName from './ClientName'

interface ClientDetailsCardProps {
	client: ScheduledClient
	siteMaps: ClientSiteMapImages[]
	isAdminPromise: Promise<{ isAdmin: boolean }>
	serviceDate?: Date
	pagePromise: Promise<number>
}
//TODO: clean up this type
export default function ClientDetailsCard({
	client,
	siteMaps,
	isAdminPromise,
	pagePromise,
}: ClientDetailsCardProps) {
	return (
		<>
			<div className="flex w-full flex-col items-center">
				<ClientName fullName={client.full_name} />
				<ClientAddress address={client.address} />
			</div>

			<div className="mt-2 flex flex-col gap-1 sm:flex-row">
				<Suspense>
					<SiteMapImageList
						addressId={client.address_id}
						isAdminPromise={isAdminPromise}
						pagePromise={pagePromise}
						siteMaps={siteMaps}
					/>
				</Suspense>
			</div>
		</>
	)
}
