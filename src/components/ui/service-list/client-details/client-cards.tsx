'use client'
import { use } from 'react'
import type { Client, ClientsReturn } from '@/types/clients-types'
import type { ParsedClientListParams } from '@/types/params-types'
import MarkYardServiced from '../../buttons/mark-yard-serviced'
import FormContainer from '../../containers/form-container'
import FormHeader from '../../header/form-header'
import ManyPointsMap from '../../map-component/many-points-map'
import ClientDetailsCard from './ClientDetailsCard'

export default function ClientCards({
	clientsPromise,
	parseClientListParamsPromise,
	snow,
	isAdminPromise,
}: {
	clientsPromise: Promise<ClientsReturn | null>
	parseClientListParamsPromise: Promise<ParsedClientListParams>
	snow: boolean
	isAdminPromise?: Promise<{ isAdmin: boolean }>
}) {
	const clients = use(clientsPromise)
	const parseClientListParams = use(parseClientListParamsPromise)
	const isAdmin = use(isAdminPromise ?? Promise.resolve({ isAdmin: false }))

	if (!parseClientListParams.serviceDate)
		return (
			<FormContainer>
				{' '}
				<FormHeader
					text={'Please select a date to see the client list'}
				/>{' '}
			</FormContainer>
		)
	if (!clients)
		return (
			<FormContainer>
				{' '}
				<p className="text-red-500">Error Loading clients</p>{' '}
			</FormContainer>
		)

	if (clients.clients.length < 1)
		return (
			<FormContainer>
				{' '}
				<FormHeader text={'No clients scheduled for today'} />{' '}
			</FormContainer>
		)

	const addresses = clients.clients.map((c: Client) => ({ address: c.address }))
	const flattenedAddresses =
		addresses?.map((address: { address: string }) => address.address) ?? []

	return (
		<ul className="flex w-full flex-col items-center gap-2 rounded-sm md:gap-4">
			{addresses && addresses?.length > 0 && (
				<FormContainer>
					<div className="flex w-full flex-col items-center justify-center gap-4 p-2 align-middle md:flex-row">
						<FormHeader
							text={`Clients Left to Service Today: ${flattenedAddresses.length}`}
						/>
						<ManyPointsMap addresses={flattenedAddresses} />
					</div>
				</FormContainer>
			)}

			{clients?.clients.map((client: Client) => (
				<FormContainer key={client.id}>
					<li className="w-full rounded-sm border bg-white/50 p-4">
						<ClientDetailsCard
							client={client}
							isAdmin={isAdmin?.isAdmin}
							searchTermIsServiced={
								parseClientListParams.searchTermIsServiced
							}
							serviceDate={parseClientListParams.serviceDate}
							snow={snow}
						/>
					</li>
					!searchTermIsServiced && serviceDate && (
					{parseClientListParams.serviceDate && (
						<MarkYardServiced
							clientId={client.id}
							serviceDate={parseClientListParams.serviceDate}
							snow={snow}
						/>
					)}
					)
				</FormContainer>
			))}
		</ul>
	)
}
