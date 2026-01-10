'use client'
import { useRouter, useSearchParams } from 'next/navigation'
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
	const router = useRouter()
	const searchParams = useSearchParams()
	const billingStatus = searchParams.get('status') || 'all'

	const statuses =
		variant === 'invoices'
			? ['all', 'draft', 'open', 'paid', 'void']
			: variant === 'quotes'
				? ['all', 'draft', 'open', 'accepted', 'canceled']
				: ['active', 'canceled', 'incomplete']

	function handleChange(value: string) {
		if (value && value !== 'status') {
			router.push(`?status=${encodeURIComponent(value)}`)
		} else {
			router.push(`?`)
		}
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
