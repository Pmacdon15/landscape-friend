import { PaginationTabs } from '../pagination/pagination-tabs'
import ManyPointsMap from '../map-component/many-points-map'
import FormContainer from '../containers/form-container'
import FormHeader from '../header/form-header'
import { Client, PaginatedClients } from '@/types/clients-types'
import ClientDetailsCard from './client-details/ClientDetailsCard'
import MarkYardServiced from '../buttons/mark-yard-serviced'

export default async function ClientListService({
	clientsPromise,
	page,
	serviceDate,
	searchTermIsServiced,
	snow = false,
	isAdmin,
}: {
	clientsPromise: Promise<PaginatedClients | null>
	page: number
	serviceDate?: Date
	searchTermIsServiced: boolean
	snow?: boolean
	isAdmin: boolean
}) {
	const result = await clientsPromise

	if (!serviceDate)
		return (
			<FormContainer>
				{' '}
				<FormHeader
					text={'Please select a date to see the client list'}
				/>{' '}
			</FormContainer>
		)
	if (!result)
		return (
			<FormContainer>
				{' '}
				<p className="text-red-500">Error Loading clients</p>{' '}
			</FormContainer>
		)
	const { clients, totalPages } = result
	if (clients.length < 1)
		return (
			<FormContainer>
				{' '}
				<FormHeader text={'No clients scheduled for today'} />{' '}
			</FormContainer>
		)

	const addresses = clients.map((c) => ({ address: c.address }))
	if (addresses instanceof Error)
		return (
			<FormContainer>
				{' '}
				<FormHeader text={`${addresses.message}`} />
			</FormContainer>
		)
	const flattenedAddresses =
		addresses?.map((address) => address.address) ?? []

	return (
		<>
			<ul className="flex flex-col gap-2 md:gap-4 rounded-sm w-full items-center">
				{addresses && addresses?.length > 0 && (
					<FormContainer>
						<div className="flex flex-col md:flex-row w-full justify-center items-center align-middle p-2 gap-4 ">
							<FormHeader
								text={`Clients Left to Service Today: ${flattenedAddresses.length}`}
							/>
							<ManyPointsMap addresses={flattenedAddresses} />
						</div>
					</FormContainer>
				)}
				<PaginationTabs
					path={`${!snow ? '/lists/cutting' : '/lists/clearing'}`}
					page={page}
					totalPages={totalPages}
				/>
				{clients.map((client: Client) => (
					<FormContainer key={client.id}>
						<li className="border p-4 rounded-sm bg-white/50 w-full">
							<ClientDetailsCard
								client={client}
								isAdmin={isAdmin}
								searchTermIsServiced={searchTermIsServiced}
								serviceDate={serviceDate}
								snow={snow}
							/>
						</li>
						{!searchTermIsServiced && serviceDate && (
							<MarkYardServiced
								clientId={client.id}
								serviceDate={serviceDate}
								snow={snow}
							/>
						)}
					</FormContainer>
				))}
			</ul>
			<PaginationTabs
				path={`${!snow ? '/lists/cutting' : '/lists/clearing'}`}
				page={page}
				totalPages={totalPages}
			/>
		</>
	)
}
