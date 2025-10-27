export function AssignedToSelectorFallback() {
	return (
		<div className="flex gap-1  ">
			<label className="flex items-center" htmlFor="assigned_to">
				Assigned To{' '}
			</label>
			<select
				className="w-fit border rounded-sm text-center py-2"
				defaultValue=""
				id="assigned_to"
				name={'assigned_to'}
			>
				<option value="">Select Member</option>
			</select>
		</div>
	)
}
