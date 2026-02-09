import { Button } from '../../button'
import QuoteHeader from './header'

export default function CreateSubscriptionFormFallback() {
	const inputClassName =
		'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
	return (
		<form className="space-y-4">
			<input type="hidden" />

			{/* Client Info */}
			<QuoteHeader />

			{/* Subscription Details */}
			<section>
				<h3 className="mb-2 font-semibold text-md">
					Subscription Details
				</h3>
				<div>
					<label
						className="block font-medium text-gray-700 text-sm"
						htmlFor="serviceType"
					>
						Service Type
					</label>
					<select className={inputClassName} id="serviceType">
						<option value="weekly">Weekly</option>
						<option value="bi-weekly">Bi-Weekly</option>
						<option value="monthly">Monthly</option>
						<option value="as-needed">Snow as needed</option>
					</select>
				</div>
				<label
					className="block font-medium text-gray-700 text-sm"
					htmlFor="startDate"
				>
					Start Date
				</label>
				<input className={inputClassName} id="startDate" type="date" />
				<label
					className="block font-medium text-gray-700 text-sm"
					htmlFor="endDate"
				>
					End Date
				</label>
				<input className={inputClassName} id="endDate" type="date" />
				<label
					className="block font-medium text-gray-700 text-sm"
					htmlFor="notes"
				>
					Notes
				</label>
				<input className={inputClassName} id="notes" type="textarea" />
			</section>

			<div>
				<Button type="submit" variant="outline">
					Create Subscription
				</Button>
			</div>
		</form>
	)
}
