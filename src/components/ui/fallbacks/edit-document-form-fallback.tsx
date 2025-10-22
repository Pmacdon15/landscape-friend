import React from 'react'
import { Button } from '../button'

export function EditDocumentFormFallback() {
	const inputClassName =
		'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
	return (
		<form className="space-y-4">
			<section>
				<h3 className="text-md font-semibold mb-2">Invoice Lines</h3>
				<div className="border p-4 mb-4 rounded-md">
					<div>
						<label
							className="block text-sm font-medium text-gray-700"
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
							className="block text-sm font-medium text-gray-700"
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
							className="block text-sm font-medium text-gray-700"
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
				<h3 className="text-md font-semibold mb-2">Totals</h3>
				<p className="font-bold">Grand Total: ${(0o0).toFixed(2)}</p>
			</section>
			<Button type="submit" variant="outline">
				Update Invoice
			</Button>
		</form>
	)
}
