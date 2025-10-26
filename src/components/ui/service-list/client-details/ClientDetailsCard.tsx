import type React from 'react'
import { Suspense } from 'react'
import type { Client } from '@/types/clients-types'
import FormHeader from '../../header/form-header'
import ImageList from '../../image-list/image-list'
import MapComponent from '../../map-component/map-component'
import ClientAddress from './ClientAddress'
import ClientEmail from './ClientEmail'
import ClientName from './ClientName'
import ClientPhoneNumber from './ClientPhoneNumber'

interface ClientDetailsCardProps {
	client: Client
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
			<div className="flex flex-col items-center w-full">
				<ClientName fullName={client.full_name} />
				<ClientPhoneNumber phoneNumber={client.phone_number} />
				<ClientEmail
					clientEmailAddress={client.email_address}
					clientFullName={client.full_name}
				/>
				<ClientAddress address={client.address} />
			</div>

			<div className="flex flex-col sm:flex-row gap-1">
				<Suspense fallback={<FormHeader text="Loading..." />}>
					<MapComponent address={client.address} />
				</Suspense>
				<ImageList client={client} isAdmin={isAdmin} />
			</div>
		</>
	)
}

export default ClientDetailsCard
