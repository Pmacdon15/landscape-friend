'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

export const ServiceStatusSelector = () => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const currentServiceStatus = searchParams.get('serviced') || 'false'

	function handleChange(next: string) {
		if (next) {
			router.push(`?serviced=${encodeURIComponent(next)}`)
		} else {
			router.push(`?`)
		}
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
