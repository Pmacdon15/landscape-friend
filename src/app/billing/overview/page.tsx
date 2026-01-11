import { Suspense } from 'react'
import { BillingOverviewTable } from '@/components/ui/billing/billing-overview-table'
import { BillingStatsComponent } from '@/components/ui/billing/billing-stats'
import FormContainer from '@/components/ui/containers/form-container'
import ManageFallback from '@/components/ui/fallbacks/manage-fallback'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import SearchForm from '@/components/ui/search/search-form'
import { fetchBillingOverviewData } from '@/lib/dal/stripe-dal'
import { parseClientListParams } from '@/lib/utils/params'

export default function BillingOverviewPage(
	props: PageProps<'/billing/overview'>,
) {
	const searchParamsPromise = props.searchParams

	return (
		<FormContainer>
			<FormHeader text="Billing Overview" />

			<Suspense
				fallback={<SearchFormFallBack variant="billing-overview" />}
			>
				<SearchForm variant="billing-overview" />
			</Suspense>

			<div className="mt-8 flex flex-col gap-8">
				<Suspense
					fallback={
						<div className="h-32 animate-pulse bg-gray-100 rounded-lg" />
					}
				>
					<StatsContainer searchParamsPromise={searchParamsPromise} />
				</Suspense>

				<Suspense fallback={<ManageFallback />}>
					<TableContainer searchParamsPromise={searchParamsPromise} />
				</Suspense>
			</div>
		</FormContainer>
	)
}

import type { SearchParams } from '@/types/params-types'

async function StatsContainer({
	searchParamsPromise,
}: {
	searchParamsPromise: Promise<SearchParams>
}) {
	const searchParams = await searchParamsPromise
	const { page, searchTerm, searchTermStatus, searchTermType } =
		parseClientListParams(searchParams)

	// We want the data but not awaited at the top level, but for stats we might need it.
	// Actually the prompt says: "promise for data to be at the top but not awaited and passed to a suspended component as low as possible"
	// So I'll pass the promise down.
	const dataPromise = fetchBillingOverviewData(
		page,
		searchTerm,
		searchTermStatus,
		searchTermType,
	)

	return <BillingStatsComponent dataPromise={dataPromise} />
}

async function TableContainer({
	searchParamsPromise,
}: {
	searchParamsPromise: Promise<SearchParams>
}) {
	const searchParams = await searchParamsPromise
	const { page, searchTerm, searchTermStatus, searchTermType } =
		parseClientListParams(searchParams)
	const dataPromise = fetchBillingOverviewData(
		page,
		searchTerm,
		searchTermStatus,
		searchTermType,
	)

	return (
		<BillingOverviewTable
			dataPromise={dataPromise}
			path="/billing/overview"
		/>
	)
}
