import { InputField } from '../inputs/input'

export default function SendEmailInputs() {
	return (
		<>
			<InputField
				name={'title'}
				type={'text'}
				placeholder={'Title'}
				required
			/>
			<textarea
				className="border rounded sm p-2 bg-white"
				id={'message'}
				name="message"
				placeholder="Your message"
				required
			/>
		</>
	)
}
