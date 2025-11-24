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

export default async function SearchForm({
	variant = 'default',
	isAdminPromise,
	orgMembersPromise,
}: {
	variant?: SearchFormVariant
	isAdminPromise?: Promise<{ isAdmin: boolean }>
	orgMembersPromise?: Promise<OrgMember[]>
}) {
	const isAdmin = await isAdminPromise
	return (
		<div className="flex flex-col flex-wrap justify-center gap-2 rounded-sm bg-white/70 p-2 shadow-lg md:flex-row">
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
					{isAdmin && <ServiceListDatePicker />}
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
