export default function AssignedToFallback() {
	return (
		<div className="mb-2 flex gap-2">
			<p className="w-28 align-middle">Assigned to : </p>
			<select
				className="w-3/6 rounded-sm border p-1 md:w-2/6"
				defaultValue={'not-assigned'}
			>
				<option value="not-assigned">Not Assigned</option>
			</select>
		</div>
	)
}
