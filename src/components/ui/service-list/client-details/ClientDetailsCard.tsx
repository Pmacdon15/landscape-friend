import { Activity, useState } from 'react'
import type { ClientResult } from '@/types/clients-types'
import { Button } from '../../button'
import ImageList from '../../image-list/image-list'
import ClientAddress from './ClientAddress'
import ClientName from './ClientName'

interface ClientDetailsCardProps {
	client: ClientResult
	isAdmin?: boolean
	searchTermIsServiced: boolean
	serviceDate?: Date
	snow: boolean
}

export default function ClientDetailsCard({
	client,
	isAdmin,
}: ClientDetailsCardProps) {
	const [showCard, setShowCard] = useState(false)
	return (
		<>
			<div className="flex w-full flex-col items-center">
				<ClientName fullName={client.full_name} />
				<ClientAddress address={client.address} />
			</div>
			<Button
				className=""
				onClick={() => setShowCard(!showCard)}
				type="button"
				variant="ghost"
			>
				{' '}
				{showCard ? 'Hide site map' : 'Show site map'}
			</Button>
			<Activity mode={showCard ? 'visible' : 'hidden'}>
				<div className="flex flex-col gap-1 sm:flex-row mt-2">
					<ImageList client={client} isAdmin={isAdmin} />
				</div>
			</Activity>
		</>
	)
}
