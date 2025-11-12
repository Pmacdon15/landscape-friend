export function AssignedToSelectorFallback() {
	return (
		<div className="flex gap-1">
			<label className="flex items-center" htmlFor="assigned_to">
				Assigned To{' '}
			</label>
			<select
				className="w-fit rounded-sm border py-2 text-center"
				defaultValue=""
				id="assigned_to"
				name={'assigned_to'}
			>
				<option value="">Select Member</option>
			</select>
		</div>
	)
}
