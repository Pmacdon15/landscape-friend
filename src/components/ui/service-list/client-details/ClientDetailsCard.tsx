import type React from 'react'
import type { ClientResult } from '@/types/clients-types'
import ImageList from '../../image-list/image-list'
import ClientAddress from './ClientAddress'
import ClientEmail from './ClientEmail'
import ClientName from './ClientName'
import ClientPhoneNumber from './ClientPhoneNumber'

interface ClientDetailsCardProps {
	client: ClientResult
	isAdmin?: boolean
	searchTermIsServiced: boolean
	serviceDate?: Date
	snow: boolean
}

const ClientDetailsCard: React.FC<ClientDetailsCardProps> = ({
	client,
	isAdmin,
}) => {
	return (
		<>
			<div className="flex w-full flex-col items-center">
				<ClientName fullName={client.full_name} />
				<ClientPhoneNumber phoneNumber={client.phone_number} />
				<ClientEmail
					clientEmailAddress={client.email_address}
					clientFullName={client.full_name}
				/>
				<ClientAddress address={client.address} />
			</div>

			<div className="flex flex-col gap-1 sm:flex-row">
				<ImageList client={client} isAdmin={isAdmin} />
			</div>
		</>
	)
}

export default ClientDetailsCard
