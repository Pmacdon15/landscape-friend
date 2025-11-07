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
				<h3 className="mb-2 font-semibold text-md">Cost Details</h3>
				<label
					className="block font-medium text-gray-700 text-sm"
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
					className="block font-medium text-gray-700 text-sm"
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
				<h3 className="mb-2 font-semibold text-md"> Items</h3>
				<div className="mb-4 rounded-md border p-4">
					<label
						className="block font-medium text-gray-700 text-sm"
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
						className="block font-medium text-gray-700 text-sm"
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
						className="block font-medium text-gray-700 text-sm"
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

			<p className="mt-2 font-bold">Total: $</p>
			<div>
				<Button type="submit" variant="outline">
					Create Quote
				</Button>
			</div>
		</form>
	)
}
