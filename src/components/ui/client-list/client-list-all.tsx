import { Suspense } from 'react'
import type { ClientListServiceProps } from '@/types/clients-types'
import DeleteClientButton from '../buttons/delete-client-button'
import ContentContainer from '../containers/content-container'
import FormContainer from '../containers/form-container'
import AssignedToFallback from '../fallbacks/assigned-to-fallback'
import FormHeader from '../header/form-header'
import ImageList from '../image-list/image-list'
import AssignedTo from '../inputs/AssignedToSelect'
import { PaginationTabs } from '../pagination/pagination-tabs'
import { ViewSitePhotoSheet } from '../sheet/view-site-phots-sheet'
import { ClientListItemEmail, ClientListItemHeader } from './client-list-item'
import ClientListItemAddress from './client-list-item-address'
import EditClientFormContainer from './edit-client-form-container'

export default async function ClientListAll({
	clientsPromise,
	isAdminPromise,
	orgMembersPromise,
	searchParamsPromise,
}: ClientListServiceProps) {
	//TODO: See if we can result theses lower
	const [isAdmin, result, searchParams] = await Promise.all([
		isAdminPromise,
		clientsPromise,
		searchParamsPromise,
	])

	if (!result)
		return (
			<ContentContainer>
				{' '}
				<p>Error Loading clients</p>{' '}
			</ContentContainer>
		)

	const { clients, accounts, addresses, totalPages } = result

	if (!clients)
		return (
			<ContentContainer>
				{' '}
				<p>Please add clients</p>{' '}
			</ContentContainer>
		)
	// console.log('clients:', clients)

	return (
		<>
			<PaginationTabs
				page={searchParams.page}
				path="/lists/client"
				totalPages={totalPages}
			/>
			<ul className="flex w-full flex-col items-center justify-center gap-4 rounded-sm">
				{clients.map((client, index) => (
					<FormContainer key={client.id}>
						<li className="relative rounded-sm border bg-white/70 p-4">
							{isAdmin?.isAdmin && (
								<DeleteClientButton
									clientId={client.id}
									page={searchParams.page}
								/>
							)}
							<FormHeader text={client.full_name} />
							<div className="mt-8 mb-8 flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
								{client.phone_number && client.phone_number && (
									<ClientListItemHeader
										clientPhoneNumber={Number(
											client.phone_number,
										)}
									/>
								)}
								{client.email_address && (
									<ClientListItemEmail
										clientEmailAddress={
											client.email_address
										}
										clientFullName={client.full_name}
									/>
								)}

								{addresses
									.filter(
										(addr) => addr.client_id === client.id,
									)
									.map((addr) => (
										<ClientListItemAddress
											clientAddress={addr.address}
											clientId={client.id}
											key={addr.id}
										/>
									))}
							</div>
							{isAdmin?.isAdmin && (
								<div className="flex flex-col items-center gap-2">
									<p>
										Amount owing: $
										{accounts[index].current_balance}{' '}
									</p>
									<div className="flex flex-col flex-wrap items-center justify-center gap-2 md:flex-row">
										{/* <Suspense
											fallback={<AssignedToFallback />}
										>
											<AssignedTo
												addressId={addresses[index].id}
												clientAssignedTo={
													'not-assigned'
												}
												clientId={client.id}
												orgMembersPromise={
													orgMembersPromise
												}
											/>
										</Suspense> */}
										<Suspense
											fallback={<AssignedToFallback />}
										>
											<AssignedTo
												addressId={addresses[index].id}
												clientAssignedTo={
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
								</div>
							)}
							{/* <CuttingWeekDropDownContainer
								client={{
									id: client.id,
									cutting_schedules: client.cutting_schedules,
								}}
								isAdmin={isAdmin?.isAdmin}
							/> */}
							<div className="flex flex-col gap-2">
								<EditClientFormContainer
									addresses={addresses
										.filter(
											(a) => a.client_id === client.id,
										)
										.map((a) => ({
											id: a.id,
											client_id: client.id,
											address: a.address,
										}))}
									client={client}
									isAdmin={isAdmin?.isAdmin || false}
									page={searchParams.page}
								/>
								<ViewSitePhotoSheet clientId={client.id} />
							</div>
							<ImageList
								client={client}
								isAdmin={isAdmin?.isAdmin}
								page={searchParams.page}
							/>
						</li>
					</FormContainer>
				))}
			</ul>
			<PaginationTabs
				page={searchParams.page}
				path="/lists/client"
				totalPages={totalPages}
			/>
		</>
	)
}
