'use client'
import { useSearchParams } from 'next/navigation'
import { useSearch } from '@/lib/hooks/use-search'
import type { VariantBillingStatusSelector } from '@/types/search-fallback-types'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

export function BillingStatusSelector({
	variant = 'invoices',
}: {
	variant?: VariantBillingStatusSelector
}) {
	const searchParams = useSearchParams()
	const { updateSearchParams } = useSearch()
	const billingStatus = searchParams.get('status') || 'all'

	const statuses =
		variant === 'invoices'
			? ['all', 'draft', 'open', 'paid', 'void']
			: variant === 'quotes'
				? ['all', 'draft', 'open', 'accepted', 'canceled']
				: variant === 'subscriptions'
					? ['all', 'active', 'canceled', 'incomplete']
					: [
							'all',
							'draft',
							'open',
							'paid',
							'void',
							'active',
							'canceled',
							'incomplete',
						]

	function handleChange(value: string) {
		updateSearchParams('status', value)
	}

	return (
		<div className="flex gap-1">
			<Select
				defaultValue={billingStatus}
				name="status"
				onValueChange={handleChange}
			>
				<SelectTrigger>
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{statuses.map((status) => (
							<SelectItem key={status} value={status}>
								{status}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}
