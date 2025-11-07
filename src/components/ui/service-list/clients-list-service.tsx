import {
	fetchCuttingClients,
	fetchSnowClearingClients,
} from '@/lib/dal/clients-dal'
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

	const result = snow
		? await fetchSnowClearingClients(
				page,
				searchTerm,
				serviceDate,
				searchTermIsServiced,
				searchTermAssignedTo,
			)
		: await fetchCuttingClients(
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
				<PaginationTabs
					page={page}
					path={`${!snow ? '/lists/cutting' : '/lists/clearing'}`}
					totalPages={totalPages}
				/>
				{clients.map((client: Client) => (
					<FormContainer key={client.id}>
						<li className="w-full rounded-sm border bg-white/50 p-4">
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
