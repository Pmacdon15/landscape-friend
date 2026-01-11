'use client'
import { useSearchParams } from 'next/navigation'
import { useSearch } from '@/lib/hooks/use-search'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

export function BillingTypeSelector() {
	const searchParams = useSearchParams()
	const { updateSearchParams } = useSearch()
	const billingType = searchParams.get('type') || 'all'

	const types = ['all', 'invoice', 'subscription']

	function handleChange(value: string) {
		updateSearchParams('type', value)
	}

	return (
		<div className="flex gap-1">
			<Select
				defaultValue={billingType}
				name="type"
				onValueChange={handleChange}
			>
				<SelectTrigger>
					<SelectValue placeholder="Type" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{types.map((type) => (
							<SelectItem key={type} value={type}>
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}
