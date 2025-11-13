'use client'
import { useOptimistic, useTransition } from 'react'
import { useUpdateCuttingDay } from '@/lib/mutations/mutations'
import type { CuttingSchedule } from '@/types/clients-types'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

function CuttingWeekDropDown({
	week,
	schedule,
	clientId,
	isAdmin,
}: {
	week: number
	schedule: CuttingSchedule
	clientId: number
	isAdmin: boolean
}) {
	const days = [
		'No cut',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	]
	const cuttingDay = schedule.cutting_day ?? 'No cut'
	const [optimisticDay, setOptimisticDay] = useOptimistic(
		cuttingDay,
		(_, newDay: string) => newDay,
	)
	const [, startTransition] = useTransition()

	const { mutate } = useUpdateCuttingDay()

	function handleChange(value: string) {
		startTransition(() => {
			setOptimisticDay(value)
		})
		mutate({
			clientId,
			cuttingWeek: week,
			cuttingDay: value,
		})
	}

	return (
		<p className="mb-3 flex flex-row items-center gap-3 text-sm md:text-base">
			<span className="w-32">Cutting week {week}:</span>
			{isAdmin ? (
				<Select onValueChange={handleChange} value={optimisticDay}>
					<SelectTrigger className="w-28">
						<SelectValue placeholder="Select Day" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{days.map((day) => (
								<SelectItem key={day} value={day}>
									{day}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			) : (
				<span className="w-28">{cuttingDay}</span>
			)}
		</p>
	)
}

interface CuttingWeekClient {
	id: number
	cutting_schedules: CuttingSchedule[]
}

export function CuttingWeekDropDownContainer({
	client,
	isAdmin = false,
}: {
	client: CuttingWeekClient
	isAdmin?: boolean
}) {
	// Ensure all weeks (1–4) have a schedule, defaulting to "No cut" if missing
	const schedules: CuttingSchedule[] = Array.from({ length: 4 }, (_, i) => {
		const week = i + 1
		const existingSchedule = client.cutting_schedules.find(
			(s) => s.cutting_week === week,
		)
		return existingSchedule || { cutting_week: week, cutting_day: 'No cut' }
	})

	return (
		<div className="flex flex-col flex-wrap items-center justify-center gap-2 md:flex-row">
			{schedules.map((schedule, index) => (
				<CuttingWeekDropDown
					clientId={client.id}
					isAdmin={isAdmin}
					key={schedule.cutting_week}
					schedule={schedule}
					week={index + 1}
				/>
			))}
		</div>
	)
}
