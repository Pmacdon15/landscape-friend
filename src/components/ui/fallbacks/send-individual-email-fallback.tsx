import FormContainer from '../containers/form-container'
import SendEmailInputs from '../emails/send-email-inputs'
import FormHeader from '../header/form-header'

export default function SendIndividualEmailFallback() {
	return (
		<FormContainer>
			<FormHeader text={`Send an Email to a client`} />
			<form className="flex flex-col gap-4 w-full">
				<select className="border rounded sm p-2 bg-white">
					<option value={' '}> </option>
				</select>
				<SendEmailInputs />
			</form>
		</FormContainer>
	)
}
