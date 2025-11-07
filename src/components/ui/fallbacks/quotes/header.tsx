import { inputClassName } from '@/lib/values'

export default function QuoteHeader() {
	return (
		<section>
			<h3 className="mb-2 font-semibold text-md">Client Information</h3>
			<div>
				<label
					className="block font-medium text-gray-700 text-sm"
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
				className="block font-medium text-gray-700 text-sm"
				htmlFor="clientEmail"
			>
				{' '}
				Email
			</label>
			<input className={inputClassName} id="clientEmail" type="text" />
			<label
				className="block font-medium text-gray-700 text-sm"
				htmlFor="phone_number"
			>
				{' '}
				Phone Number
			</label>
			<input className={inputClassName} id="phone_number" type="text" />
			<label
				className="block font-medium text-gray-700 text-sm"
				htmlFor="address"
			>
				{' '}
				Address
			</label>
			<input className={inputClassName} id="address" type="text" />
		</section>
	)
}
