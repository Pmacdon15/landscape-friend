import { Suspense } from 'react'
import type { OrgMember } from '@/types/clerk-types'
import type { SearchFormVariant } from '@/types/search-fallback-types'
import { AssignedToSelectorFallback } from '../fallbacks/search/assigned-to-selector-fallback'
import { SearchInput } from '../inputs/search-input'
import { AssignedToSelector } from '../selectors/assigned-to-selector'
import { BillingStatusSelector } from '../selectors/billing-status-selector'
import { BillingTypeSelector } from '../selectors/billing-type-selector'
import { CuttingPeriodSelector } from '../selectors/cutting-period-selector'
import { ServiceStatusSelector } from '../selectors/service-status-selector'
import { ServiceListDatePicker } from '../service-list/service-list-date-picker'

export default async function SearchForm({
	variant = 'default',
	isAdminPromise,
	orgMembersPromise,
}: {
	variant?: SearchFormVariant
	isAdminPromise?: Promise<{ isAdmin: boolean }>
	orgMembersPromise?: Promise<OrgMember[] | { errorMessage: string }>
}) {
	const isAdmin = await isAdminPromise

	return (
		<div className="grid grid-cols-1 items-center justify-center gap-3 rounded-md bg-white/70 p-4 shadow-lg backdrop-blur-sm sm:grid-cols-2 lg:flex lg:flex-wrap">
			<div className="w-full lg:w-auto">
				<SearchInput />
			</div>

			{isAdmin?.isAdmin && (
				<div className="w-full lg:w-auto">
					<Suspense fallback={<AssignedToSelectorFallback />}>
						<AssignedToSelector
							orgMembersPromise={orgMembersPromise}
						/>
					</Suspense>
				</div>
			)}

			{variant === 'default' && (
				<>
					<div className="w-full lg:w-auto">
						<CuttingPeriodSelector variant="week" />
					</div>
					<div className="w-full lg:w-auto">
						<CuttingPeriodSelector variant="day" />
					</div>
				</>
			)}

			{variant === 'cutting' && (
				<>
					<div className="w-full lg:w-auto">
						<ServiceListDatePicker />
					</div>
					<div className="w-full lg:w-auto">
						<ServiceStatusSelector />
					</div>
				</>
			)}

			{variant === 'clearing' && (
				<>
					<div className="w-full lg:w-auto">
						<ServiceStatusSelector />
					</div>
					<div className="w-full lg:w-auto">
						<ServiceListDatePicker />
					</div>
				</>
			)}

			{variant === 'invoices' && (
				<div className="w-full lg:w-auto">
					<BillingStatusSelector variant="invoices" />
				</div>
			)}

			{variant === 'quotes' && (
				<div className="w-full lg:w-auto">
					<BillingStatusSelector variant="quotes" />
				</div>
			)}

			{variant === 'subscriptions' && (
				<div className="w-full lg:w-auto">
					<BillingStatusSelector variant="subscriptions" />
				</div>
			)}

			{variant === 'billing-overview' && (
				<>
					<div className="w-full lg:w-auto">
						<BillingTypeSelector />
					</div>
					<div className="w-full lg:w-auto">
						<BillingStatusSelector variant="billing-overview" />
					</div>
				</>
			)}
		</div>
	)
}
