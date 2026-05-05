'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import type { ServiceHistoryItem } from '@/types/service-history-types'
import ContentContainer from '../containers/content-container'
import FormContainer from '../containers/form-container'
import FormHeader from '../header/form-header'
import Spinner from '../loaders/spinner'

export function useInfiniteServiceHistory(
	search: string,
	serviceType: string,
	assignedTo: string,
	date: string,
) {
	return useInfiniteQuery({
		queryKey: [
			'service-history-infinite',
			{ search, serviceType, assignedTo, date },
		],
		queryFn: async ({ pageParam = 1 }) => {
			const url = new URL('/api/service-history', window.location.origin)
			url.searchParams.set('page', String(pageParam))
			if (search) url.searchParams.set('search', search)
			if (serviceType) url.searchParams.set('serviceType', serviceType)
			if (assignedTo) url.searchParams.set('assignedTo', assignedTo)
			if (date) url.searchParams.set('date', date)

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

export default function ServiceHistoryClient() {
	const searchParams = useSearchParams()

	const search = searchParams.get('search') ?? ''
	const serviceType = searchParams.get('serviceType') ?? ''
	const assignedTo = searchParams.get('assignedTo') ?? ''
	const date = searchParams.get('date') ?? ''

	const sentinelRef = useRef<HTMLDivElement>(null)

	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = useInfiniteServiceHistory(search, serviceType, assignedTo, date)

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
				<div className="flex w-full items-center justify-center p-8">
					<Spinner variant="notification-menu" />
				</div>
			</ContentContainer>
		)
	}

	if (status === 'error') {
		return (
			<ContentContainer>
				<p>Error Loading history: {error?.message}</p>
			</ContentContainer>
		)
	}

	const hasServices = data?.pages.some(
		(page) => page?.services && page.services.length > 0,
	)

	if (!hasServices) {
		return (
			<ContentContainer>
				<p>No past services found matching your criteria.</p>
			</ContentContainer>
		)
	}

	return (
		<>
			<ul className="flex w-full flex-col items-center justify-center gap-4 rounded-sm">
				{data?.pages.map((page, groupIndex) => (
					<div
						className="flex w-full flex-col items-center justify-center gap-4"
						key={groupIndex}
					>
						{page?.services?.map((service: ServiceHistoryItem) => (
							<FormContainer key={service.id}>
								<li className="relative rounded-sm border bg-white/70 p-4">
									<div className="mb-2 flex flex-col items-center justify-between rounded-t-md border-b bg-gray-50 p-2 md:flex-row">
										<div className="font-semibold text-green-900 text-lg">
											{service.service_type === 'grass'
												? '🌾 Grass Cut'
												: '❄️ Snow Cleared'}
										</div>
										<div className="font-medium text-gray-500 text-sm">
											{service.service_date}
										</div>
									</div>

									<FormHeader text={service.client_name} />

									<div className="mt-4 mb-4 flex w-full flex-col items-center justify-center gap-2">
										<p className="rounded-md bg-gray-100 px-4 py-2 text-center font-medium text-gray-700 shadow-inner">
											📍 {service.address}
										</p>
										<p className="mt-2 text-gray-600 text-sm">
											Assigned to:{' '}
											<span className="font-semibold">
												{service.assigned_to_name ||
													'N/A'}
											</span>
										</p>
									</div>

									{service.image_url ? (
										<div className="mt-4 flex flex-col items-center gap-2">
											<p className="mb-2 font-bold text-gray-500 text-sm underline">
												Completion Photo
											</p>
											<div className="relative h-64 w-full overflow-hidden rounded-md border border-gray-200 shadow-md md:w-96">
												<Image
													alt="Service completion photo"
													className="object-cover"
													fill
													sizes="(max-width: 768px) 100vw, 384px"
													src={service.image_url}
												/>
											</div>
										</div>
									) : (
										<div className="mt-4 flex flex-col items-center opacity-60">
											<p className="text-gray-400 italic">
												No photo uploaded for this
												service.
											</p>
										</div>
									)}
								</li>
							</FormContainer>
						))}
					</div>
				))}
			</ul>

			{/* Intersection Observer target for infinite scroll */}
			<div
				className="mt-4 mb-4 flex h-10 w-full items-center justify-center"
				ref={sentinelRef}
			>
				{isFetchingNextPage ? (
					<Spinner variant="notification-menu" />
				) : hasNextPage ? (
					<div className="rounded-sm bg-white/60 p-2">
						<span className="text-black">Scroll for more</span>
					</div>
				) : (
					<div className="rounded-sm bg-white/60 p-2">
						<span className="text-black text-sm">
							End of history
						</span>
					</div>
				)}
			</div>
		</>
	)
}
