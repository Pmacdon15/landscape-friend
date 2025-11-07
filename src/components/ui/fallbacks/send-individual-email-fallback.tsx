import FormContainer from '../containers/form-container'
import SendEmailInputs from '../emails/send-email-inputs'
import FormHeader from '../header/form-header'

export default function SendIndividualEmailFallback() {
	return (
		<FormContainer>
			<FormHeader text={`Send an Email to a client`} />
			<form className="flex w-full flex-col gap-4">
				<select className="sm rounded border bg-white p-2">
					<option value={' '}> </option>
				</select>
				<SendEmailInputs />
			</form>
		</FormContainer>
	)
}
