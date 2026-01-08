'use client'
import { useOptimistic, useTransition } from 'react'
import { useUpdateCuttingDay } from '@/lib/mutations/mutations'
import type { ClientCuttingSchedule } from '@/types/schedules-types'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

function CuttingWeekDropDown({
	addressId,
	week,
	schedule,
}: {
	addressId: number
	week: number
	schedule: ClientCuttingSchedule
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
			addressId: addressId,
			cuttingWeek: week,
			cuttingDay: value,
		})
	}

	return (
		<p className="mb-3 flex flex-row items-center gap-3 text-sm md:text-base">
			<span className="w-32">Cutting week {week}:</span>

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
		</p>
	)
}

export function CuttingWeekDropDownContainer({
	addressId,
	schedules,
}: {
	addressId: number
	schedules: ClientCuttingSchedule[]
}) {
	// Filter schedules for THIS address first
	const addressSchedules = schedules.filter((s) => s.address_id === addressId)

	// Ensure all weeks (1–4) have a schedule, defaulting to "No cut" if missing
	const clientSchedules: ClientCuttingSchedule[] = Array.from(
		{ length: 4 },
		(_, i) => {
			const week = i + 1
			const existingSchedule = addressSchedules.find(
				(s) => s.cutting_week === week,
			)
			return (
				existingSchedule || {
					id: 0,
					address_id: addressId,
					cutting_week: week,
					cutting_day: 'No cut',
				}
			)
		},
	)

	return (
		<div className="flex flex-col flex-wrap items-center justify-center gap-2 md:flex-row">
			{clientSchedules.map((schedule, index) => (
				<CuttingWeekDropDown
					addressId={addressId}
					key={schedule.cutting_week}
					schedule={schedule}
					week={index + 1}
				/>
			))}
		</div>
	)
}
