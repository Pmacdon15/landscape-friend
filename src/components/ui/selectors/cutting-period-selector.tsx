'use client'
import { useOptimistic, useTransition } from 'react'
import { useCuttingPeriodSearch } from '@/lib/hooks/hooks'

import { days, weeks } from '@/lib/values'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

export function CuttingPeriodSelector({
	variant,
}: {
	variant: 'week' | 'day'
}) {
	const { currentPeriod, setCuttingPeriod } = useCuttingPeriodSearch(variant)
	const [optimisticPeriod, setOptimisticPeriod] = useOptimistic(
		currentPeriod,
		(_, newPeriod: string) => newPeriod,
	)
	const [, startTransition] = useTransition()

	const label = variant === 'week' ? 'Cutting Week' : 'Cutting Day'
	const options = variant === 'week' ? weeks : days

	function handleChange(value: string) {
		startTransition(() => {
			setOptimisticPeriod(value === "all" ? "" : value)
			setCuttingPeriod(value === "all" ? "" : value)
		})
	}

	return (
		<div className="flex gap-1">
			<label className="flex items-center" htmlFor={variant}>
				{label}{' '}
			</label>
			<Select
				name={variant}
				onValueChange={handleChange}
				value={optimisticPeriod || "all"}
			>
				<SelectTrigger >
					<SelectValue placeholder="All" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value={"all"}>All</SelectItem>
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}