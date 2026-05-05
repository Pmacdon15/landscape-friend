'use client'

import type { Route } from 'next'
import { useSearchParams } from 'next/navigation'
import { use } from 'react'
import { cn } from '@/lib/utils/utils'
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
		<div className="mt-12 mb-12 flex justify-center">
			<div className="rounded-full border border-white/20 bg-white/80 p-2 shadow-xl backdrop-blur-md">
				<Pagination>
					<PaginationContent className="gap-2">
						<PaginationItem>
							<PaginationPrevious
								className={cn(
									'rounded-full border bg-white/50 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white',
									page <= 1
										? 'pointer-events-none opacity-30 grayscale'
										: '',
								)}
								href={createPageUrl(page - 1) as Route}
							/>
						</PaginationItem>
						<PaginationItem>
							<div className="px-4 py-2 font-semibold text-primary/80 text-sm">
								<span className="text-primary">{page}</span>
								<span className="mx-1 text-muted-foreground/50">
									/
								</span>
								<span>{totalPages}</span>
							</div>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext
								className={cn(
									'rounded-full border bg-white/50 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white',
									page >= totalPages
										? 'pointer-events-none opacity-30 grayscale'
										: '',
								)}
								href={createPageUrl(page + 1) as Route}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	)
}
