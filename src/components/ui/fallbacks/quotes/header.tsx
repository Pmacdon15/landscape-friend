import { inputClassName } from '@/lib/values'

export default function QuoteHeader() {
	return (
		<section>
			<h3 className="text-md font-semibold mb-2">Client Information</h3>
			<div>
				<label
					className="block text-sm font-medium text-gray-700"
					htmlFor="clientName"
				>
					Name
				</label>
				<input
					className={inputClassName}
					id="clientName"
					list="clients-list"
				/>
				<datalist id="clients-list"></datalist>
			</div>
			<label
				className="block text-sm font-medium text-gray-700"
				htmlFor="clientEmail"
			>
				{' '}
				Email
			</label>
			<input className={inputClassName} id="clientEmail" type="text" />
			<label
				className="block text-sm font-medium text-gray-700"
				htmlFor="phone_number"
			>
				{' '}
				Phone Number
			</label>
			<input className={inputClassName} id="phone_number" type="text" />
			<label
				className="block text-sm font-medium text-gray-700"
				htmlFor="address"
			>
				{' '}
				Address
			</label>
			<input className={inputClassName} id="address" type="text" />
		</section>
	)
}
