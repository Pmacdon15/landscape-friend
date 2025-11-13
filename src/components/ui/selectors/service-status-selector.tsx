'use client'
import { useServiceStatusSearch } from '@/lib/hooks/hooks'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

export const ServiceStatusSelector = () => {
	const { currentServiceStatus, setServiceStatus } = useServiceStatusSearch()

	function handleChange(value: string) {
		setServiceStatus(value)
	}

	return (
		<Select onValueChange={handleChange} value={currentServiceStatus}>
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
