import { Suspense } from 'react'
import { fetchAllClients } from '@/lib/dal/clients-dal'
import { isOrgAdmin } from '@/lib/utils/clerk'
import { parseClientListParams } from '@/lib/utils/params'
import type { ClientListServiceProps } from '@/types/clients-types'
import DeleteClientButton from '../buttons/delete-client-button'
import ContentContainer from '../containers/content-container'
import FormContainer from '../containers/form-container'
import { CuttingWeekDropDownContainer } from '../cutting-week/cutting-week'
import AssignedToFallback from '../fallbacks/assigned-to-fallback'
import FormHeader from '../header/form-header'
import ImageList from '../image-list/image-list'
import AssignedTo from '../inputs/AssignedToSelect'
import MapComponent from '../map-component/map-component'
import { PaginationTabs } from '../pagination/pagination-tabs'
import { ViewSitePhotoSheet } from '../sheet/view-site-phots-sheet'
import { ClientListItemEmail, ClientListItemHeader } from './client-list-item'
import ClientListItemAddress from './client-list-item-address'

export default async function ClientListService({
	props,
	orgMembersPromise,
}: ClientListServiceProps) {
	const [{ isAdmin }, searchParams] = await Promise.all([
		isOrgAdmin(),
		props.searchParams,
	])

	const {
		page,
		searchTerm,
		searchTermCuttingWeek,
		searchTermCuttingDay,
		searchTermAssignedTo,
	} = parseClientListParams(searchParams)
	const result = await fetchAllClients(
		page,
		searchTerm,
		searchTermCuttingWeek,
		searchTermCuttingDay,
		searchTermAssignedTo,
	)

	if (!result)
		return (
			<ContentContainer>
				{' '}
				<p>Error Loading clients</p>{' '}
			</ContentContainer>
		)
	const { clients, totalPages } = result

	if (clients.length < 1)
		return (
			<ContentContainer>
				{' '}
				<p>Please add clients</p>{' '}
			</ContentContainer>
		)

	return (
		<>
			<PaginationTabs
				page={page}
				path="/lists/client"
				totalPages={totalPages}
			/>
			<ul className="flex flex-col gap-4 rounded-sm w-full items-center justify-center">
				{clients.map((client) => (
					<FormContainer key={client.id}>
						<li className="border p-4 rounded-sm relative bg-white/70">
							{isAdmin && (
								<DeleteClientButton clientId={client.id} />
							)}
							<FormHeader text={client.full_name} />
							<div className="flex flex-col gap-2 items-center justify-center mt-8 mb-8 lg:flex-row w-full">
								<ClientListItemHeader
									clientPhoneNumber={client.phone_number}
								/>
								<ClientListItemEmail
									clientEmailAddress={client.email_address}
									clientFullName={client.full_name}
								/>
								<ClientListItemAddress
									clientAddress={client.address}
									clientId={client.id}
								>
									<MapComponent address={client.address} />
								</ClientListItemAddress>
							</div>
							{isAdmin && (
								<div className="flex flex-col gap-2 md:flex-row items-center flex-wrap justify-center">
									<p>Amount owing: ${client.amount_owing} </p>
									<Suspense fallback={<AssignedToFallback />}>
										<AssignedTo
											clientAssignedTo={
												client.grass_assigned_to ||
												'not-assigned'
											}
											clientId={client.id}
											orgMembersPromise={
												orgMembersPromise
											}
										/>
									</Suspense>
									<Suspense fallback={<AssignedToFallback />}>
										<AssignedTo
											clientAssignedTo={
												client.snow_assigned_to ||
												'not-assigned'
											}
											clientId={client.id}
											orgMembersPromise={
												orgMembersPromise
											}
											snow
										/>
									</Suspense>
								</div>
							)}
							<CuttingWeekDropDownContainer
								client={{
									id: client.id,
									cutting_schedules: client.cutting_schedules,
								}}
								isAdmin={isAdmin}
							/>
							<ViewSitePhotoSheet clientId={client.id} />
							<ImageList client={client} isAdmin={isAdmin} />
						</li>
					</FormContainer>
				))}
			</ul>
			<PaginationTabs
				page={page}
				path="/lists/client"
				totalPages={totalPages}
			/>
		</>
	)
}
