import type { ClientResult } from '@/types/clients-types'
import ImageList from '../../image-list/image-list'
import ClientAddress from './ClientAddress'
import ClientName from './ClientName'

interface ClientDetailsCardProps {
	client: ClientResult
	isAdmin?: boolean
	searchTermIsServiced: boolean
	serviceDate?: Date
	snow: boolean
	page: number
}

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

			<div className="mt-2 flex flex-col gap-1 sm:flex-row">
				<ImageList client={client} isAdmin={isAdmin} page={page} />
			</div>
		</>
	)
}
