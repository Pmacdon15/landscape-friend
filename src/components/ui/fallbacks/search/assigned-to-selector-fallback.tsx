export function AssignedToSelectorFallback() {
	return (
		<div className="flex gap-1  ">
			<label className="flex items-center">Assigned To </label>
			<select
				name={'assigned_to'}
				className="w-fit border rounded-sm text-center py-2"
				value=""
			>
				<option value="">Select Member</option>
			</select>
		</div>
	)
}
