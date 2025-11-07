export const ServiceStatusSelectorFallback = () => {
	return (
		<select
			className="w-fit rounded-sm border p-2 text-center"
			name="serviced"
		>
			<option value="false">Un-serviced</option>
			<option value="true">Serviced</option>
		</select>
	)
}
