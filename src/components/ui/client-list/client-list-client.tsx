'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
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
import EditClientFormContainer from './edit-client-form-container'

interface ClientListClientProps {
	isAdminPromise: Promise<{ isAdmin: boolean }>
	orgMembersPromise: Promise<OrgMember[] | { errorMessage: string }>
}

export function useInfiniteClients(
	search: string,
	week: string,
	day: string,
	assigned: string,
) {
	return useInfiniteQuery({
		queryKey: ['clients-infinite', { search, week, day, assigned }],
		queryFn: async ({ pageParam = 1 }) => {
			const url = new URL('/api/clients', window.location.origin)
			url.searchParams.set('page', String(pageParam))
			url.searchParams.set('search', search || '')
			url.searchParams.set('week', week || '0')
			url.searchParams.set('day', day || '')
			url.searchParams.set('assigned', assigned || '')

			const res = await fetch(url.toString())
			if (!res.ok) {
				throw new Error('Network response was not ok')
			}
			return res.json()
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const totalPages = lastPage?.totalPages ?? 1
			const nextPage = allPages.length + 1
			return nextPage <= totalPages ? nextPage : undefined
		},
	})
}

export default function ClientListClient({
	isAdminPromise,
	orgMembersPromise,
}: ClientListClientProps) {
	const searchParams = useSearchParams()

	const search = searchParams.get('search') ?? ''
	const week = searchParams.get('week') ?? '0'
	const day = searchParams.get('day') ?? ''
	const assigned = searchParams.get('assigned') ?? ''

	const sentinelRef = useRef<HTMLDivElement>(null)

	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = useInfiniteClients(search, week, day, assigned)

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasNextPage &&
					!isFetchingNextPage
				) {
					fetchNextPage()
				}
			},
			{ threshold: 0.1 },
		)

		if (sentinelRef.current) observer.observe(sentinelRef.current)
		return () => observer.disconnect()
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	if (status === 'pending') {
		return (
			<ContentContainer>
				<p>Loading clients...</p>
			</ContentContainer>
		)
	}

	if (status === 'error') {
		return (
			<ContentContainer>
				<p>Error Loading clients: {error?.message}</p>
			</ContentContainer>
		)
	}

	const hasClients = data?.pages.some(
		(page) => page?.clients && page.clients.length > 0,
	)

	if (!hasClients) {
		return (
			<ContentContainer>
				<p>Please add clients</p>
			</ContentContainer>
		)
	}

	return (
		<>
			<ul className="flex w-full flex-col items-center justify-center gap-4 rounded-sm">
				{data?.pages.map((page, groupIndex) => (
					<div className="w-full flex flex-col justify-center items-center gap-4" key={groupIndex}>
						{page?.clients?.map((client: Client) => {
							const clientAddresses = (
								page.addresses || []
							).filter(
								(a: ClientAddress) =>
									a && a.client_id === client.id,
							)
							const clientAddressIds = clientAddresses.map(
								(a: ClientAddress) => a.id,
							)
							const clientAssignments = (
								page.assignments || []
							).filter((a: ClientAssignment) =>
								clientAddressIds.includes(a.address_id),
							)
							const clientSchedules = (
								page.schedules || []
							).filter((s: ClientCuttingSchedule) =>
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
							const clientSiteMaps = (page.siteMaps || []).filter(
								(siteMap: ClientSiteMapImages) =>
									clientAddresses
										.map((a: ClientAddress) => a.id)
										.includes(siteMap.address_id),
							)
							const account = (page.accounts || []).find(
								(acc: ClientAccount) =>
									acc.client_id === client.id,
							)

							return (
								<FormContainer key={client.id}>
									<li className="relative rounded-sm border bg-white/70 p-4">
										<Suspense>
											<DeleteClientButton
												clientId={client.id}
												pagePromise={Promise.resolve(1)}
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
														clientAddress={
															addr.address
														}
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
												isAdminPromise={
													isAdminPromise ||
													Promise.resolve({
														isAdmin: false,
													})
												}
												orgMembersPromise={
													orgMembersPromise
												}
												pagePromise={Promise.resolve(1)}
												schedules={clientSchedules}
												siteMaps={clientSiteMaps}
											/>
										</div>

										<div className="mt-2 flex flex-col gap-2">
											<Suspense>
												<EditClientFormContainer
													addresses={editAddresses}
													client={client}
													pagePromise={Promise.resolve(
														1,
													)}
												/>
											</Suspense>
										</div>
									</li>
								</FormContainer>
							)
						})}
					</div>
				))}
			</ul>

			{/* Intersection Observer target for infinite scroll */}
			<div
				className="h-10 w-full flex items-center justify-center mt-4 mb-4"
				ref={sentinelRef}
			>
				{isFetchingNextPage ? (
					<span>Loading more...</span>
				) : hasNextPage ? (
					<span>Scroll for more</span>
				) : null}
			</div>
		</>
	)
}
