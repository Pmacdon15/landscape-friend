'use client'
import { useSearchParams } from 'next/navigation'
import { useSearch } from '@/lib/hooks/use-search'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

export const ServiceStatusSelector = () => {
	const searchParams = useSearchParams()
	const { updateSearchParams } = useSearch()

	const currentServiceStatus = searchParams.get('serviced') || 'false'

	function handleChange(next: string) {
		updateSearchParams('serviced', next)
	}

	return (
		<Select
			defaultValue={currentServiceStatus}
			onValueChange={handleChange}
		>
			<SelectTrigger>
				<SelectValue placeholder="Select Status" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="false">Un-serviced</SelectItem>
					<SelectItem value="true">Serviced</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
