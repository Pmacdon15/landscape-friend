import { Suspense } from 'react'
import type { OrgMember } from '@/types/clerk-types'
import type { SearchFormVariant } from '@/types/search-fallback-types'
import { AssignedToSelectorFallback } from '../fallbacks/search/assigned-to-selector-fallback'
import { SearchInput } from '../inputs/search-input'
import { AssignedToSelector } from '../selectors/assigned-to-selector'
import { BillingStatusSelector } from '../selectors/billing-status-selector'
import { CuttingPeriodSelector } from '../selectors/cutting-period-selector'
import { ServiceStatusSelector } from '../selectors/service-status-selector'
import { ServiceListDatePicker } from '../service-list/service-list-date-picker'

export default function SearchForm({
	variant = 'default',
	orgMembersPromise,
	isAdmin = false,
}: {
	variant?: SearchFormVariant
	orgMembersPromise?: Promise<OrgMember[]>
	isAdmin?: boolean
}) {
	return (
		<div className="flex flex-wrap flex-col md:flex-row gap-2 justify-center bg-white/70 p-2 rounded-sm shadow-lg">
			<SearchInput />
			{isAdmin &&
				variant !== 'invoices' &&
				variant !== 'quotes' &&
				variant !== 'subscriptions' && (
					<Suspense fallback={<AssignedToSelectorFallback />}>
						<AssignedToSelector
							orgMembersPromise={orgMembersPromise}
						/>
					</Suspense>
				)}
			{variant === 'default' && (
				<>
					<CuttingPeriodSelector variant="week" />
					<CuttingPeriodSelector variant="day" />
				</>
			)}
			{variant === 'cutting' && (
				<>
					<ServiceListDatePicker />
					<ServiceStatusSelector />
				</>
			)}
			{variant === 'clearing' && <ServiceStatusSelector />}
			{variant === 'invoices' && (
				<BillingStatusSelector variant="invoices" />
			)}
			{variant === 'quotes' && <BillingStatusSelector variant="quotes" />}
			{variant === 'subscriptions' && (
				<BillingStatusSelector variant="subscriptions" />
			)}
		</div>
	)
}
