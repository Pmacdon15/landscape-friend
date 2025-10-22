import { inputClassName } from '@/lib/values'
import { Button } from '../../button'
import QuoteHeader from './header'

export function CreateQuoteFormFallback() {
	return (
		<>
			<form className="space-y-4">
				<input type="hidden" />

				{/* Client Info */}
				<QuoteHeader />

				{/* Labour Details */}
				<section>
					<h3 className="text-md font-semibold mb-2">Cost Details</h3>
					<label
						htmlFor="labourCostPerUnit"
						className="block text-sm font-medium text-gray-700"
					>
						Labour Cost (per unit)
					</label>
					<input
						id="labourCostPerUnit"
						type="number"
						className={inputClassName}
						min="0"
						step="0.01"
						defaultValue={0}
					/>
					<label
						htmlFor="labourUnits"
						className="block text-sm font-medium text-gray-700"
					>
						Labour Units
					</label>
					<input
						id="labourUnits"
						type="number"
						className={inputClassName}
						min="1"
						step="1"
						defaultValue={0}
					/>
				</section>

				{/* Dynamic Materials Section */}
				<section>
					<h3 className="text-md font-semibold mb-2"> Items</h3>
					<div className="border p-4 mb-4 rounded-md">
						<label
							htmlFor="materialType"
							className="block text-sm font-medium text-gray-700"
						>
							Material
						</label>
						<input
							id={`materialType`}
							type="text"
							className={inputClassName}
						/>
						<label
							htmlFor="materialCostPerUnit"
							className="block text-sm font-medium text-gray-700"
						>
							Material Cost (per unit)
						</label>
						<input
							id={'materialCostPerUnit'}
							type="number"
							className={inputClassName}
							min="0"
							step="0.01"
							defaultValue={0}
						/>
						<label
							htmlFor="materialUnits"
							className="block text-sm font-medium text-gray-700"
						>
							Material Units
						</label>
						<input
							id={'materialUnits'}
							type="number"
							className={inputClassName}
							min="1"
							step="1"
							defaultValue={0}
						/>
					</div>

					<Button type="button" className="mt-2">
						Add Item
					</Button>
				</section>

				<p className="font-bold mt-2">Total: $</p>
				<div>
					<Button variant="outline" type="submit">
						Create Quote
					</Button>
				</div>
			</form>
		</>
	)
}
