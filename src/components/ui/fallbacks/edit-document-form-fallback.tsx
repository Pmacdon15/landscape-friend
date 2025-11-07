import { Button } from '../button'

export function EditDocumentFormFallback() {
	const inputClassName =
		'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
	return (
		<form className="space-y-4">
			<section>
				<h3 className="mb-2 font-semibold text-md">Invoice Lines</h3>
				<div className="mb-4 rounded-md border p-4">
					<div>
						<label
							className="block font-medium text-gray-700 text-sm"
							htmlFor={`lines.description`}
						>
							Description:
						</label>
						<input
							className={inputClassName}
							id={`lines.description`}
							type="text"
						/>
					</div>
					<div>
						<label
							className="block font-medium text-gray-700 text-sm"
							htmlFor={`lines.amount`}
						>
							Amount (per unit):
						</label>
						<input
							className={inputClassName}
							id={`lines.amount`}
							min="0"
							step="0.01"
							type="number"
						/>
					</div>
					<div>
						<label
							className="block font-medium text-gray-700 text-sm"
							htmlFor={`lines.quantity`}
						>
							Quantity:
						</label>
						<input
							className={inputClassName}
							id={`lines.quantity`}
							min="1"
							step="1"
							type="number"
						/>
					</div>
					<Button className="mt-2">Remove Line</Button>
				</div>
			</section>
			<section>
				<h3 className="mb-2 font-semibold text-md">Totals</h3>
				<p className="font-bold">Grand Total: ${(0o0).toFixed(2)}</p>
			</section>
			<Button type="submit" variant="outline">
				Update Invoice
			</Button>
		</form>
	)
}
