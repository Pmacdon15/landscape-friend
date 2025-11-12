'use client'
import { useOptimistic, useTransition } from 'react'
import { useCuttingPeriodSearch } from '@/lib/hooks/hooks'

import { days, weeks } from '@/lib/values'

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

	function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const newPeriod = e.target.value
		startTransition(() => {
			setOptimisticPeriod(newPeriod)
			setCuttingPeriod(newPeriod)
		})
	}

	return (
		<div className="flex gap-1">
			<label className="flex items-center" htmlFor={variant}>
				{label}{' '}
			</label>
			<select
				className="w-fit rounded-sm border py-2 text-center"
				id={variant}
				name={variant}
				onChange={handleChange}
				value={optimisticPeriod}
			>
				<option value="">All</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	)
}
