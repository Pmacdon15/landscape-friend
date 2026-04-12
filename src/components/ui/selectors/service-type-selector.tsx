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

export const ServiceTypeSelector = () => {
	const searchParams = useSearchParams()
	const { updateSearchParams } = useSearch()

	const currentServiceType = searchParams.get('serviceType') || ''

	function handleChange(next: string) {
		updateSearchParams('serviceType', next === 'all' ? '' : next)
	}

	// We use "all" to map to empty string for clearing the filter
	return (
		<Select
			defaultValue={currentServiceType || 'all'}
			onValueChange={handleChange}
		>
			<SelectTrigger>
				<SelectValue placeholder="All Services" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="all">All Services</SelectItem>
					<SelectItem value="grass">Grass Cutting</SelectItem>
					<SelectItem value="snow">Snow Clearing</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
