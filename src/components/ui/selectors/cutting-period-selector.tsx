'use client'
import { useRouter, useSearchParams } from 'next/navigation'
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

	const router = useRouter()
	const searchParams = useSearchParams()
	const dayOrWeekSearchParam = searchParams.get(`${variant}`) || ''

	function handleChange(value: string) {
		if (value && value !== 'assigned_to') {
			router.push(`?${variant}=${encodeURIComponent(value)}`)
		} else {
			router.push(`?`)
		}
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
