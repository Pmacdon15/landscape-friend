import { InputField } from '../inputs/input'

export default function SendEmailInputs() {
	return (
		<>
			<InputField
				name={'title'}
				placeholder={'Title'}
				required
				type={'text'}
			/>
			<textarea
				className="sm rounded border bg-white p-2"
				id={'message'}
				name="message"
				placeholder="Your message"
				required
			/>
		</>
	)
}
