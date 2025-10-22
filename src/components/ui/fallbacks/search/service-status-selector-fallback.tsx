export const ServiceStatusSelectorFallback = () => {
	return (
		<select
			className="w-fit border rounded-sm text-center p-2"
			name="serviced"
		>
			<option value="false">Un-serviced</option>
			<option value="true">Serviced</option>
		</select>
	)
}
