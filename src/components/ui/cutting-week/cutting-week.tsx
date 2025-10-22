'use client'
import { useUpdateCuttingDay } from '@/lib/mutations/mutations'
import type { CuttingSchedule } from '@/types/clients-types'

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
	// Ensure the cutting_day is either the schedule's cutting_day or "No cut"
	const cuttingDay = schedule.cutting_day ?? 'No cut'

	const { mutate } = useUpdateCuttingDay()

	return (
		<p className="flex flex-row items-center gap-3 mb-3 text-sm md:text-base">
			<span className="w-32">Cutting week {week}:</span>
			{isAdmin ? (
				<select
					className="w-28"
					onChange={(event) =>
						mutate({
							clientId,
							cuttingWeek: week,
							cuttingDay: event.target.value,
						})
					}
					value={cuttingDay}
				>
					{days.map((day) => (
						<option key={day} value={day}>
							{day}
						</option>
					))}
				</select>
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
	isAdmin,
}: {
	client: CuttingWeekClient
	isAdmin: boolean
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
		<div className="flex flex-col gap-2 md:flex-row items-center flex-wrap justify-center">
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
