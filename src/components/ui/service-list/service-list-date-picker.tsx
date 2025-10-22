'use client'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useServiceDateSearch } from '@/lib/hooks/hooks'

export const ServiceListDatePicker = () => {
	const { currentServiceDate, setServiceDate } = useServiceDateSearch()

	// Parse currentServiceDate as a local date
	const parseLocalDate = (dateStr: string) => {
		if (!dateStr) return null
		const [year, month, day] = dateStr.split('-').map(Number)
		const date = new Date(year, month - 1, day)
		return isNaN(date.getTime()) ? null : date // Return null for invalid dates
	}

	const handleDateChange = (date: Date | null) => {
		if (date) {
			// Format as local YYYY-MM-DD
			const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
			setServiceDate(localDateStr)
		} else {
			setServiceDate('') // Clear the date if null is passed
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
		<DatePicker
			wrapperClassName="custom-datepicker-wrapper"
			portalId="root-portal"
			withPortal
			selected={parseLocalDate(currentServiceDate)}
			onChange={handleDateChange}
			className="border rounded-sm p-2"
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
		/>
	)
}
