'use client'
import { useMemo, useState } from 'react'

export const ColoredDatePicker = () => {
	const [date, setDate] = useState(new Date())
	const [isOpen, setIsOpen] = useState(false)

	const getWeekNumber = (d: Date) => {
		const date = new Date(d.getTime())
		date.setHours(0, 0, 0, 0)
		// Thursday in current week decides the year.
		date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
		// January 4 is always in week 1.
		const week1 = new Date(date.getFullYear(), 0, 4)
		// Adjust to Thursday in week 1 and count number of weeks from date to week1.
		return (
			1 +
			Math.round(
				((date.getTime() - week1.getTime()) / 86400000 -
					3 +
					((week1.getDay() + 6) % 7)) /
					7,
			)
		)
	}

	const getWeekColorClass = (date: Date) => {
		const week = getWeekNumber(date) % 4
		switch (week) {
			case 1:
				return 'bg-red-200'
			case 2:
				return 'bg-green-200'
			case 3:
				return 'bg-blue-200'
			case 0:
				return 'bg-yellow-200' // case 0 is week 4
			default:
				return ''
		}
	}

	const daysInMonth = useMemo(() => {
		const d = new Date(date)
		d.setDate(1)
		const days = []
		const month = d.getMonth()
		const year = d.getFullYear()

		const firstDayOfMonth = new Date(year, month, 1).getDay()
		const daysInPrevMonth = new Date(year, month, 0).getDate()

		for (let i = firstDayOfMonth - 1; i >= 0; i--) {
			days.push({ day: daysInPrevMonth - i, isCurrentMonth: false })
		}

		const numDays = new Date(year, month + 1, 0).getDate()
		for (let i = 1; i <= numDays; i++) {
			days.push({ day: i, isCurrentMonth: true })
		}

		const lastDayOfMonth = new Date(year, month, numDays).getDay()
		for (let i = 1; i < 7 - lastDayOfMonth; i++) {
			days.push({ day: i, isCurrentMonth: false })
		}
		return days
	}, [date])

	const handleDateSelect = (day: number, isCurrentMonth: boolean) => {
		const newDate = new Date(date)
		if (isCurrentMonth) {
			newDate.setDate(day)
		}
		setDate(newDate)
		setIsOpen(false)
	}

	const changeMonth = (amount: number) => {
		const newDate = new Date(date)
		newDate.setMonth(newDate.getMonth() + amount)
		setDate(newDate)
	}

	return (
		<div className="relative inline-block text-left">
			<div>
				<input
					className="w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
					onClick={() => setIsOpen(!isOpen)}
					readOnly
					type="text"
					value={date.toLocaleDateString()}
				/>
			</div>

			{isOpen && (
				<div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
					<div className="p-2">
						<div className="flex justify-between items-center mb-2">
							<button
								className="px-2 py-1 rounded-md hover:bg-gray-100"
								onClick={() => changeMonth(-1)}
								type="button"
							>
								&lt;
							</button>
							<div className="text-lg font-semibold">
								{date.toLocaleString('default', {
									month: 'long',
									year: 'numeric',
								})}
							</div>
							<button
								className="px-2 py-1 rounded-md hover:bg-gray-100"
								onClick={() => changeMonth(1)}
								type="button"
							>
								&gt;
							</button>
						</div>
						<div className="grid grid-cols-7 gap-1 text-center">
							{[
								'Sun',
								'Mon',
								'Tue',
								'Wed',
								'Thu',
								'Fri',
								'Sat',
							].map((day) => (
								<div
									className="font-medium text-xs text-gray-500"
									key={day}
								>
									{day}
								</div>
							))}
							{daysInMonth.map(({ day, isCurrentMonth }) => {
								const currentDate = new Date(
									date.getFullYear(),
									date.getMonth(),
									day,
								)
								const colorClass = isCurrentMonth
									? getWeekColorClass(currentDate)
									: 'bg-gray-100'
								return (
									<button
										className={`py-1 rounded-md text-sm ${isCurrentMonth ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-400'} ${colorClass}`}
										key={day}
										onClick={() =>
											handleDateSelect(
												day,
												isCurrentMonth,
											)
										}
										type="button"
									>
										{day}
									</button>
								)
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
