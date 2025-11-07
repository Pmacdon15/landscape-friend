'use client'
import { useServiceStatusSearch } from '@/lib/hooks/hooks'

export const ServiceStatusSelector = () => {
	const { currentServiceStatus, setServiceStatus } = useServiceStatusSearch()

	return (
		<select
			className="w-fit rounded-sm border py-2 text-center"
			name="serviced"
			onChange={(e) => setServiceStatus(e.target.value)}
			value={currentServiceStatus}
		>
			<option value="false">Un-serviced</option>
			<option value="true">Serviced</option>
		</select>
	)
}
