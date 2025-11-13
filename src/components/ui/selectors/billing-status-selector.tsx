'use client'
import { useOptimistic, useTransition } from 'react'
import type { VariantBillingStatusSelector } from '@/types/search-fallback-types'
import { useBillingStatusSearch } from '../../../lib/hooks/hooks'
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
	const { currentStatus, setBillingStatus } = useBillingStatusSearch()
	const [optimisticStatus, setOptimisticStatus] = useOptimistic(
		currentStatus,
		(_, newValue: string) => newValue,
	)
	const [, startTransition] = useTransition()

	const statuses =
		variant === 'invoices'
			? ['all', 'draft', 'open', 'paid', 'void']
			: variant === 'quotes'
				? ['all', 'draft', 'open', 'accepted', 'canceled']
				: ['active', 'canceled', 'incomplete']

	function handleChange(value: string) {
		startTransition(() => {
			setOptimisticStatus(value)
			setBillingStatus(value)
		})
	}

	return (
		<div className="flex gap-1">
			<Select
				name="status"
				onValueChange={handleChange}
				value={optimisticStatus}
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
