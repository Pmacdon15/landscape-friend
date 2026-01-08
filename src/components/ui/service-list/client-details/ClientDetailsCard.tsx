import type { ScheduledClient } from '@/types/assignment-types'
import ClientAddress from './ClientAddress'
import ClientName from './ClientName'

interface ClientDetailsCardProps {
	client: ScheduledClient
	isAdmin?: boolean
	searchTermIsServiced: boolean
	serviceDate?: Date
	snow: boolean
	page: number
}
//TODO: clean up this type
export default function ClientDetailsCard({
	client,
	isAdmin,
	page,
}: ClientDetailsCardProps) {
	return (
		<>
			<div className="flex w-full flex-col items-center">
				<ClientName fullName={client.full_name} />
				<ClientAddress address={client.address} />
			</div>

			{/* //TODO: fix this with new schema */}
			{/* <div className="mt-2 flex flex-col gap-1 sm:flex-row">
				<ImageList client={client} isAdmin={isAdmin} page={page} />
			</div> */}
		</>
	)
}
