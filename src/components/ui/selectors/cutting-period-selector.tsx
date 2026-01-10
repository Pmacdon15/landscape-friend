'use client'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
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

	const search = searchParams.get('search')

	const updateAssignedTo = useDebouncedCallback(
		(next: string) => {
			if (next && next !== 'assigned_to') {
				router.push(`?assigned_to=${encodeURIComponent(next)}`)
			} else {
				router.push(`?`)
			}
		},
		{ wait: 1000 },
	)
	

	return (
		<div className="flex gap-1">
			<label className="flex items-center" htmlFor={variant}>
				{label}{' '}
			</label>
			<Select
				defaultValue={search || 'all'}
				name={variant}
				// value={optimisticPeriod || 'all'}
				onValueChange={updateAssignedTo}
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
