'use client'

import { Suspense, use } from 'react'
import type { ClientAssignment } from '@/types/assignment-types'
import type { OrgMember } from '@/types/clerk-types'
import type {
	Client,
	ClientAccount,
	ClientAddress,
} from '@/types/clients-types'
import type { ClientCuttingSchedule } from '@/types/schedules-types'
import type { ClientSiteMapImages } from '@/types/site-maps-types'
import DeleteClientButton from '../buttons/delete-client-button'
import ContentContainer from '../containers/content-container'
import FormContainer from '../containers/form-container'
import FormHeader from '../header/form-header'
import AddressManagementSection from './address-management-section'
import { ClientListItemEmail, ClientListItemHeader } from './client-list-item'
import ClientListItemAddress from './client-list-item-address'
import ClientListPagination from './client-list-pagination'
import EditClientFormContainer from './edit-client-form-container'

interface ClientListClientProps {
	isAdminPromise: Promise<{ isAdmin: boolean }>
	orgMembersPromise: Promise<OrgMember[] | { errorMessage: string }>
	clientsPromise: Promise<{
		clients: Client[]
		addresses: ClientAddress[]
		accounts: ClientAccount[]
		assignments: ClientAssignment[]
		schedules: ClientCuttingSchedule[]
		siteMaps: ClientSiteMapImages[]
		totalPages: number
	} | null>
	pagePromise: Promise<number>
}

export default function ClientListClient({
	isAdminPromise,
	orgMembersPromise,
	clientsPromise,
	pagePromise,
}: ClientListClientProps) {
	const data = use(clientsPromise)

	if (!data || data.clients.length === 0) {
		return (
			<ContentContainer>
				<p>Please add clients</p>
			</ContentContainer>
		)
	}

	const {
		clients,
		addresses,
		accounts,
		assignments,
		schedules,
		siteMaps,
		totalPages,
	} = data

	return (
		<>
			<ul className="flex w-full flex-col items-center justify-center gap-4 rounded-sm">
				<div className="flex w-full flex-col items-center justify-center gap-4">
					{clients.map((client: Client) => {
						const clientAddresses = (addresses || []).filter(
							(a: ClientAddress) =>
								a && a.client_id === client.id,
						)
						const clientAddressIds = clientAddresses.map(
							(a: ClientAddress) => a.id,
						)
						const clientAssignments = (assignments || []).filter(
							(a: ClientAssignment) =>
								clientAddressIds.includes(a.address_id),
						)
						const clientSchedules = (schedules || []).filter(
							(s: ClientCuttingSchedule) =>
								clientAddresses
									.map((a: ClientAddress) => a.id)
									.includes(s.address_id),
						)
						const editAddresses = clientAddresses.map(
							(a: ClientAddress) => ({
								id: a.id,
								client_id: client.id,
								address: a.address,
							}),
						)
						const clientSiteMaps = (siteMaps || []).filter(
							(siteMap: ClientSiteMapImages) =>
								clientAddresses
									.map((a: ClientAddress) => a.id)
									.includes(siteMap.address_id),
						)
						const account = (accounts || []).find(
							(acc: ClientAccount) => acc.client_id === client.id,
						)

						return (
							<FormContainer key={client.id}>
								<li className="relative rounded-sm border bg-white/70 p-4">
									<Suspense>
										<DeleteClientButton
											clientId={client.id}
											pagePromise={pagePromise}
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
												clientFullName={
													client.full_name
												}
											/>
										)}

										{clientAddresses.map(
											(addr: ClientAddress) => (
												<ClientListItemAddress
													clientAddress={addr.address}
													clientId={client.id}
													key={addr.id}
												/>
											),
										)}
									</div>

									<div className="flex flex-col items-center gap-2">
										<p>
											Amount owing: $
											{account
												? account.current_balance
												: 0}
										</p>

										<AddressManagementSection
											addresses={clientAddresses}
											assignments={clientAssignments}
											isAdminPromise={isAdminPromise}
											orgMembersPromise={
												orgMembersPromise
											}
											pagePromise={pagePromise}
											schedules={clientSchedules}
											siteMaps={clientSiteMaps}
										/>
									</div>

									<div className="mt-2 flex flex-col gap-2">
										<Suspense>
											<EditClientFormContainer
												addresses={editAddresses}
												client={client}
												pagePromise={pagePromise}
											/>
										</Suspense>
									</div>
								</li>
							</FormContainer>
						)
					})}
				</div>
			</ul>
			<Suspense>
				<ClientListPagination
					pagePromise={pagePromise}
					totalPages={totalPages}
				/>
			</Suspense>
		</>
	)
}
