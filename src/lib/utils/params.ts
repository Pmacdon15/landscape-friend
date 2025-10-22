import type { ParsedClientListParams, SearchParams } from '@/types/params-types'

export function parseClientListParams(
	params: SearchParams,
): ParsedClientListParams {
	const page = Number(params.page ?? 1)
	const searchTerm = String(params.search ?? '')
	const serviceDateInput = params.date ? String(params.date) : undefined
	const serviceDate =
		serviceDateInput && !isNaN(new Date(serviceDateInput).getTime())
			? new Date(serviceDateInput)
			: undefined
	const searchTermIsServiced = params.serviced === 'true' // Always return a boolean
	const searchTermCuttingWeek = Number(params.week ?? 0)
	const searchTermCuttingDay = String(params.day ?? '')
	const searchTermAssignedTo = String(params.assigned ?? '')
	const searchTermStatus = String(params.status ?? '')

	return {
		page,
		searchTerm,
		serviceDate,
		searchTermIsServiced,
		searchTermCuttingWeek,
		searchTermCuttingDay,
		searchTermAssignedTo,
		searchTermStatus,
	}
}
