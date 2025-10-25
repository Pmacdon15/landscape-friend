import { fetchCuttingClients } from '@/lib/dal/clients-dal'
import { parseClientListParams } from '@/lib/utils/params'
import type { Client } from '@/types/clients-types'
import MarkYardServiced from '../buttons/mark-yard-serviced'
import FormContainer from '../containers/form-container'
import FormHeader from '../header/form-header'
import ManyPointsMap from '../map-component/many-points-map'
import { PaginationTabs } from '../pagination/pagination-tabs'
import ClientDetailsCard from './client-details/ClientDetailsCard'

export default async function ClientListService({
	snow = false,
	isAdminPromise,
	props,
}: {
	snow?: boolean
	isAdminPromise?: Promise<{ isAdmin: boolean }>
	props: PageProps<'/lists/cutting'> | PageProps<'/lists/clearing'>
}) {
	const [isAdmin, searchParams] = await Promise.all([
		isAdminPromise,
		props.searchParams,
	])

	const {
		page,
		searchTerm,
		serviceDate,
		searchTermIsServiced,
		searchTermAssignedTo,
	} = parseClientListParams(searchParams)

	const result = await fetchCuttingClients(
		page,
		searchTerm,
		serviceDate,
		searchTermIsServiced,
		searchTermAssignedTo,
	)

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
					page={page}
					path={`${!snow ? '/lists/cutting' : '/lists/clearing'}`}
					totalPages={totalPages}
				/>
				{clients.map((client: Client) => (
					<FormContainer key={client.id}>
						<li className="border p-4 rounded-sm bg-white/50 w-full">
							<ClientDetailsCard
								client={client}
								isAdmin={isAdmin?.isAdmin}
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
				page={page}
				path={`${!snow ? '/lists/cutting' : '/lists/clearing'}`}
				totalPages={totalPages}
			/>
		</>
	)
}
