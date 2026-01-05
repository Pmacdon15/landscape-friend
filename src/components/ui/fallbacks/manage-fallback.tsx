import Spinner from '../loaders/spinner'

export default function ManageFallback() {
	return (
		<div className="grid grid-cols-1 gap-4">
			<div className="rounded-lg bg-white p-4 shadow-md">
				<div className="flex items-center justify-between">
					<h3 className="text-center font-semibold text-lg w-full">
						Loading <Spinner />
					</h3>
				</div>
			</div>
		</div>
	)
}
