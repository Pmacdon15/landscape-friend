import type { VariantBillingStatusSelector } from '@/types/search-fallback-types'

export function BillingStatusSelectorFallback({
	variant = 'invoices',
}: {
	variant?: VariantBillingStatusSelector
}) {
	const statuses =
		variant === 'invoices'
			? ['all', 'draft', 'open', 'paid', 'void']
			: ['all', 'open', 'accepted', 'canceled']

	return (
		<select
			className="w-fit rounded-sm border p-2 text-center"
			name="status"
		>
			{statuses.map((status) => (
				<option key={status} value={status}>
					{status}
				</option>
			))}
		</select>
	)
}
