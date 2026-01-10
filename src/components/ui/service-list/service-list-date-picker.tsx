'use client'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useSearch } from '@/lib/hooks/use-search'

export const ServiceListDatePicker = () => {
	const searchParams = useSearchParams()
	const { updateSearchParams } = useSearch()

	const date =
		searchParams.get('date') ||
		`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`

	// Parse currentServiceDate as a local date
	const parseLocalDate = (dateStr: string) => {
		if (!dateStr) return null
		const [year, month, day] = dateStr.split('-').map(Number)
		const date = new Date(year, month - 1, day)
		return Number.isNaN(date.getTime()) ? null : date // Return null for invalid dates
	}

	const handleDateChange = (date: Date | null) => {
		if (date) {
			// Format as local YYYY-MM-DD
			const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
			updateSearchParams('date', localDateStr)
		}
	}

	const getWeekNumber = (date: Date) => {
		const startOfYear = new Date(date.getFullYear(), 0, 1)
		const daysSinceStart = Math.floor(
			(date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
		)
		return (
			Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7) % 4 || 4
		)
	}

	return (
		<Suspense>
			<DatePicker
				className="rounded-sm border bg-white/40 p-1 font-light"
				dayClassName={(date) => {
					const week = getWeekNumber(date)
					return week === 1
						? 'bg-blue-200'
						: week === 2
							? 'bg-green-200'
							: week === 3
								? 'bg-yellow-200'
								: 'bg-red-200'
				}}
				onChange={handleDateChange}
				portalId="root-portal"
				selected={date ? parseLocalDate(date) : null}
				withPortal
				wrapperClassName="custom-datepicker-wrapper"
			/>
		</Suspense>
	)
}
