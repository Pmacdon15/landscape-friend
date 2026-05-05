'use client'

import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Route } from 'next'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from '../pagination'

interface ClientListPaginationProps {
	pagePromise: Promise<number>
	totalPages: number
}

export default function ClientListPagination({
	pagePromise,
	totalPages,
}: ClientListPaginationProps) {
	const page = use(pagePromise)
	const searchParams = useSearchParams()

	const createPageUrl = (pageNumber: number) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('page', pageNumber.toString())
		return `?${params.toString()}`
	}

	return (
		<div className="mt-8 mb-8">
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href={createPageUrl(page - 1) as Route}
							className={
								page <= 1
									? 'pointer-events-none opacity-50'
									: ''
							}
						/>
					</PaginationItem>
					<PaginationItem>
						<span className="px-4 py-2 text-sm text-muted-foreground">
							Page {page} of {totalPages}
						</span>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext
							href={createPageUrl(page + 1) as Route}
							className={
								page >= totalPages
									? 'pointer-events-none opacity-50'
									: ''
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
}
