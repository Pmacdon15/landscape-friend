'use client'
import { useSearchParams } from 'next/navigation'
import { useSearch } from '@/lib/hooks/use-search'
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
	// const { currentPeriod, setCuttingPeriod } = useCuttingPeriodSearch(variant)
	// const [optimisticPeriod, setOptimisticPeriod] = useOptimistic(
	// 	currentPeriod,
	// 	(_, newPeriod: string) => newPeriod,
	// )
	// const [, startTransition] = useTransition()

	const label = variant === 'week' ? 'Cutting Week' : 'Cutting Day'
	const options = variant === 'week' ? weeks : days

	const searchParams = useSearchParams()
	const { updateSearchParams } = useSearch()
	const dayOrWeekSearchParam = searchParams.get(`${variant}`) || ''

	function handleChange(value: string) {
		updateSearchParams(variant, value)
	}

	return (
		<div className="flex gap-1">
			<label className="flex items-center" htmlFor={variant}>
				{label}{' '}
			</label>
			<Select
				defaultValue={dayOrWeekSearchParam || 'all'}
				name={variant}
				// value={optimisticPeriod || 'all'}
				onValueChange={handleChange}
			>
				<SelectTrigger>
					<SelectValue placeholder="All" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value={'all'}>All</SelectItem>
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
