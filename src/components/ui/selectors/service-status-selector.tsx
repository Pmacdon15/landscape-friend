'use client'
import { useServiceStatusSearch } from '@/lib/hooks/hooks'

export const ServiceStatusSelector = () => {
	const { currentServiceStatus, setServiceStatus } = useServiceStatusSearch()

	return (
		<select
			className="w-fit border rounded-sm text-center py-2"
			name="serviced"
			onChange={(e) => setServiceStatus(e.target.value)}
			value={currentServiceStatus}
		>
			<option value="false">Un-serviced</option>
			<option value="true">Serviced</option>
		</select>
	)
}
