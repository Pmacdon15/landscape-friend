import { Suspense } from 'react'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import { CardView } from '@/components/ui/manage/subscription/manage-subscription-card-view'
import { PaginationTabs } from '@/components/ui/pagination/pagination-tabs'
import SearchForm from '@/components/ui/search/search-form'
import { fetchSubscriptions } from '@/lib/dal/stripe-dal'
import { parseClientListParams } from '@/lib/utils/params'
import type { SearchParams } from '@/types/params-types'

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<SearchParams>
}) {
	const params = await searchParams
	const { searchTermStatus, page, searchTerm } = parseClientListParams(params)
	const { subscriptions, totalPages } = await fetchSubscriptions(
		searchTermStatus,
		page,
		searchTerm,
	)

	return (
		<FormContainer>
			<FormHeader text={'Manage Subscriptions'} />
			<Suspense fallback={<SearchFormFallBack variant="subscriptions" />}>
				<SearchForm variant="subscriptions" />
			</Suspense>
			<PaginationTabs
				fullWidth
				page={page}
				path={'/billing/manage/subscriptions'}
				totalPages={totalPages}
			/>
			<CardView subscriptions={subscriptions} />
			<PaginationTabs
				fullWidth
				page={page}
				path={'/billing/manage/subscriptions'}
				totalPages={totalPages}
			/>
		</FormContainer>
	)
}
