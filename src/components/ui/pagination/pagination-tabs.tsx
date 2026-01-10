'use client'

import type { Route } from 'next'
import { useSearchParams } from 'next/navigation'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'

export function PaginationTabs({
	fullWidth = false,
	path,
	totalPages,
}: {
	fullWidth?: boolean
	path: Route
	totalPages: number
}) {
	const searchParams = useSearchParams()
	const query = Object.fromEntries(searchParams.entries())

	const page = Number(searchParams.get('page'))

	return totalPages > 1 ? (
		<div
			className={`rounded-sm bg-white/30 p-2 shadow-lg ${fullWidth ? 'w-full' : 'max-sm:w-full sm:w-4/6 md:w-5/6'}`}
		>
			<Pagination>
				<PaginationContent>
					{page > 1 && (
						<PaginationItem>
							<PaginationPrevious
								href={{
									pathname: path,
									query: { ...query, page: page - 1 },
								}}
							/>
						</PaginationItem>
					)}
					{page > 2 && (
						<PaginationItem>
							<PaginationLink
								href={{
									pathname: path,
									query: { ...query, page: 1 },
								}}
							>
								1
							</PaginationLink>
						</PaginationItem>
					)}
					{page > 3 && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}
					{Array.from(
						{
							length:
								Math.min(totalPages, page + 1) -
								Math.max(1, page - 1) +
								1,
						},
						(_, i) => Math.max(1, page - 1) + i,
					).map((p) => (
						<PaginationItem key={p}>
							<PaginationLink
								href={{
									pathname: path,
									query: { ...query, page: p },
								}}
								isActive={p === page}
							>
								{p}
							</PaginationLink>
						</PaginationItem>
					))}
					{page < totalPages - 2 && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}
					{page < totalPages - 1 && (
						<PaginationItem>
							<PaginationLink
								href={{
									pathname: path,
									query: { ...query, page: totalPages },
								}}
							>
								{totalPages}
							</PaginationLink>
						</PaginationItem>
					)}
					{page < totalPages && (
						<PaginationItem>
							<PaginationNext
								href={{
									pathname: path,
									query: { ...query, page: page + 1 },
								}}
							/>
						</PaginationItem>
					)}
				</PaginationContent>
			</Pagination>
		</div>
	) : null
}
