export type SearchParams = Record<
	string,
	string | string[] | number | undefined
>

export interface ParsedClientListParams {
	page: number
	searchTerm: string
	serviceDate: Date | undefined
	searchTermIsServiced: boolean
	searchTermCuttingWeek: number
	searchTermCuttingDay: string
	searchTermAssignedTo: string
	searchTermStatus: string
}

export interface Props {
	showForm: boolean
	setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}
