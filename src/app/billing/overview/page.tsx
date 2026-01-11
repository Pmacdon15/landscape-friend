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
	const billingStatsPromise = searchParamsPromise
		.then((searchParams) => parseClientListParams(searchParams))
		.then((params) =>
			fetchBillingOverviewData(
				params.page,
				params.searchTerm,
				params.searchTermStatus,
				params.searchTermType,
			),
		)
	const billingOverViewPromise = searchParamsPromise
		.then((searchParams) => parseClientListParams(searchParams))
		.then((params) =>
			fetchBillingOverviewData(
				params.page,
				params.searchTerm,
				params.searchTermStatus,
				params.searchTermType,
			),
		)

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
						<div className="h-32 animate-pulse rounded-lg bg-gray-100" />
					}
				>
					<BillingStatsComponent
						billingStatsPromise={billingStatsPromise}
					/>
				</Suspense>

				<Suspense fallback={<ManageFallback />}>
					<BillingOverviewTable
						dataPromise={billingOverViewPromise}
						path="/billing/overview"
					/>
				</Suspense>
			</div>
		</FormContainer>
	)
}
