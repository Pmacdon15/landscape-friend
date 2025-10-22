import { Suspense } from 'react'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import { ManageQuoteCardView } from '@/components/ui/manage/quotes/manage-quotes-card-view'
import { PaginationTabs } from '@/components/ui/pagination/pagination-tabs'
import SearchForm from '@/components/ui/search/search-form'
import { fetchQuotes } from '@/lib/dal/stripe-dal'
import { parseClientListParams } from '@/lib/utils/params'
import type { SearchParams } from '@/types/params-types'

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<SearchParams>
}) {
	const params = await searchParams
	const { searchTermStatus, page, searchTerm } = parseClientListParams(params)
	const { quotes, totalPages } = await fetchQuotes(
		searchTermStatus,
		page,
		searchTerm,
	)
	return (
		<FormContainer>
			<FormHeader text={'Manage Quotes'} />
			<Suspense fallback={<SearchFormFallBack variant="quotes" />}>
				<SearchForm variant="quotes" />
			</Suspense>
			<PaginationTabs
				fullWidth
				page={page}
				path={'/billing/manage/quotes'}
				totalPages={totalPages}
			/>
			<ManageQuoteCardView quotes={quotes} />
			<PaginationTabs
				fullWidth
				page={page}
				path={'/billing/manage/quotes'}
				totalPages={totalPages}
			/>
		</FormContainer>
	)
}
