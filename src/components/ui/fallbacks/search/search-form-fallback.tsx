import { Suspense } from 'react'
import type { SearchFormVariant } from '@/types/search-fallback-types'
import { BillingStatusSelectorFallback } from './billing-status-selector-fallback'
import { CuttingPeriodSelectorFallback } from './cutting-period-selector-fallback'
import { SearchInputFallback } from './search-input-fallback'
import { ServiceListDatePickerFallback } from './service-list-date-picker-fallback'
import { ServiceStatusSelectorFallback } from './service-status-selector'

export default function SearchFormFallBack({
	variant = 'default',
}: {
	variant?: SearchFormVariant
}) {
	return (
		<div className="flex flex-col justify-center gap-2 rounded-sm bg-white/70 p-2 shadow-lg md:flex-row">
			<SearchInputFallback />
			{variant === 'default' && (
				<>
					<CuttingPeriodSelectorFallback variant="week" />
					<CuttingPeriodSelectorFallback variant="day" />
				</>
			)}
			{variant === 'cutting' && (
				<>
					<Suspense>
						<ServiceListDatePickerFallback />
					</Suspense>
					<ServiceStatusSelectorFallback />
				</>
			)}
			{variant === 'clearing' && <ServiceStatusSelectorFallback />}
			{variant === 'invoices' && (
				<BillingStatusSelectorFallback variant="invoices" />
			)}
			{variant === 'quotes' && (
				<BillingStatusSelectorFallback variant="quotes" />
			)}
		</div>
	)
}
