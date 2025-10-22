import { SearchInputFallback } from './search-input-fallback'
import { SearchFormVariant } from '@/types/search-fallback-types'
import { CuttingPeriodSelectorFallback } from './cutting-period-selector-fallback'
import { BillingStatusSelectorFallback } from './billing-status-selector-fallback'
import { ServiceStatusSelectorFallback } from './service-status-selector'
import { ServiceListDatePickerFallback } from './servicel-list-date-picker-fallback'

export default function SearchFormFallBack({
	variant = 'default',
}: {
	variant?: SearchFormVariant
}) {
	return (
		<div className="flex flex-col md:flex-row gap-2 justify-center bg-white/70 p-2 rounded-sm shadow-lg">
			<SearchInputFallback />
			{variant === 'default' && (
				<>
					<CuttingPeriodSelectorFallback variant="week" />
					<CuttingPeriodSelectorFallback variant="day" />
				</>
			)}
			{variant === 'cutting' && (
				<>
					<ServiceListDatePickerFallback />
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
