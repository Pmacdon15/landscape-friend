import { Suspense } from 'react'
import type { Client, ClientListServiceProps } from '@/types/clients-types'
import DeleteClientButton from '../buttons/delete-client-button'
import ContentContainer from '../containers/content-container'
import FormContainer from '../containers/form-container'
import FormHeader from '../header/form-header'
import { PaginationTabs } from '../pagination/pagination-tabs'
import AddressManagementSection from './address-management-section'
import { ClientListItemEmail, ClientListItemHeader } from './client-list-item'
import ClientListItemAddress from './client-list-item-address'
import EditClientFormContainer from './edit-client-form-container'

export default async function ClientListAll({
	clientsPromise,
	isAdminPromise,
	orgMembersPromise,
	searchParamsPromise,
}: ClientListServiceProps) {
	const result = await clientsPromise

	if (!result)
		return (
			<ContentContainer>
				<p>Error Loading clients</p>
			</ContentContainer>
		)

	const {
		clients,
		accounts,
		addresses,
		assignments,
		schedules,
		siteMaps,
		totalPages,
	} = result

	if (!clients || clients.length === 0)
		return (
			<ContentContainer>
				<p>Please add clients</p>
			</ContentContainer>
		)

	console.log('siteMaps:', siteMaps)

	return (
		<>
			<PaginationTabs path="/lists/client" totalPages={totalPages} />

			<ul className="flex w-full flex-col items-center justify-center gap-4 rounded-sm">
				{clients.map((client: Client, _index) => {
					// PRECOMPUTE data for this client
					const clientAddresses = addresses.filter(
						(a) => a && a.client_id === client.id,
					)
					console.log('clientAddresses', clientAddresses)

					const clientAddressIds = clientAddresses.map((a) => a.id)

					const clientAssignments = assignments.filter((a) =>
						clientAddressIds.includes(a.address_id),
					)

					const clientSchedules = schedules.filter((s) =>
						clientAddresses.map((a) => a.id).includes(s.address_id),
					)

					const editAddresses = clientAddresses.map((a) => ({
						id: a.id,
						client_id: client.id,
						address: a.address,
					}))

					const clientSiteMaps = siteMaps.filter((siteMap) =>
						clientAddresses
							.map((a) => a.id)
							.includes(siteMap.address_id),
					)
					const account = accounts.find(
						(acc) => acc.client_id === client.id,
					)
					// console.log('clientSiteMap: ', clientSiteMaps)

					return (
						<FormContainer key={client.id}>
							<li className="relative rounded-sm border bg-white/70 p-4">
								<Suspense>
									<DeleteClientButton
										clientId={client.id}
										pagePromise={searchParamsPromise.then(
											(params) => params.page,
										)}
									/>
								</Suspense>

								<FormHeader text={client.full_name} />

								<div className="mt-8 mb-8 flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
									{client.phone_number && (
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

									{clientAddresses.map((addr) => (
										<ClientListItemAddress
											clientAddress={addr.address}
											clientId={client.id}
											key={addr.id}
										/>
									))}
								</div>

								<div className="flex flex-col items-center gap-2">
									<p>
										Amount owing: $
										{account ? account.current_balance : 0}
									</p>

									<AddressManagementSection
										addresses={clientAddresses}
										assignments={clientAssignments}
										isAdminPromise={
											isAdminPromise ||
											Promise.resolve({ isAdmin: false })
										}
										orgMembersPromise={orgMembersPromise}
										pagePromise={searchParamsPromise.then(
											(params) => params.page,
										)}
										schedules={clientSchedules}
										siteMaps={clientSiteMaps}
									/>
								</div>

								<div className="mt-2 flex flex-col gap-2">
									<Suspense>
										<EditClientFormContainer
											addresses={editAddresses}
											client={client}
											pagePromise={searchParamsPromise.then(
												(params) => params.page,
											)}
										/>
									</Suspense>
								</div>
							</li>
						</FormContainer>
					)
				})}
			</ul>

			<PaginationTabs path="/lists/client" totalPages={totalPages} />
		</>
	)
}
