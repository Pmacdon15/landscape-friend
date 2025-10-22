import { inputClassName } from '@/lib/values'
import { Button } from '../../button'
import QuoteHeader from './header'

export function CreateQuoteFormFallback() {
	return (
		<form className="space-y-4">
			<input type="hidden" />

			{/* Client Info */}
			<QuoteHeader />

			{/* Labour Details */}
			<section>
				<h3 className="text-md font-semibold mb-2">Cost Details</h3>
				<label
					className="block text-sm font-medium text-gray-700"
					htmlFor="labourCostPerUnit"
				>
					Labour Cost (per unit)
				</label>
				<input
					className={inputClassName}
					defaultValue={0}
					id="labourCostPerUnit"
					min="0"
					step="0.01"
					type="number"
				/>
				<label
					className="block text-sm font-medium text-gray-700"
					htmlFor="labourUnits"
				>
					Labour Units
				</label>
				<input
					className={inputClassName}
					defaultValue={0}
					id="labourUnits"
					min="1"
					step="1"
					type="number"
				/>
			</section>

			{/* Dynamic Materials Section */}
			<section>
				<h3 className="text-md font-semibold mb-2"> Items</h3>
				<div className="border p-4 mb-4 rounded-md">
					<label
						className="block text-sm font-medium text-gray-700"
						htmlFor="materialType"
					>
						Material
					</label>
					<input
						className={inputClassName}
						id={`materialType`}
						type="text"
					/>
					<label
						className="block text-sm font-medium text-gray-700"
						htmlFor="materialCostPerUnit"
					>
						Material Cost (per unit)
					</label>
					<input
						className={inputClassName}
						defaultValue={0}
						id={'materialCostPerUnit'}
						min="0"
						step="0.01"
						type="number"
					/>
					<label
						className="block text-sm font-medium text-gray-700"
						htmlFor="materialUnits"
					>
						Material Units
					</label>
					<input
						className={inputClassName}
						defaultValue={0}
						id={'materialUnits'}
						min="1"
						step="1"
						type="number"
					/>
				</div>

				<Button className="mt-2" type="button">
					Add Item
				</Button>
			</section>

			<p className="font-bold mt-2">Total: $</p>
			<div>
				<Button type="submit" variant="outline">
					Create Quote
				</Button>
			</div>
		</form>
	)
}
