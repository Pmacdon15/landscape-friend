import { Button } from '../button'
import SendClientEmailButton from '../buttons/send-client-email-button'
import SendNewsLetterButton from '../buttons/send-news-letter-button'
import FormContainer from '../containers/form-container'
import FormHeader from '../header/form-header'
import SendEmailInputs from './send-email-inputs'

export default async function SendEmailComponent({
	clientDataPromise,
	clientName: propClientName,
	clientEmail: propClientEmail,
	popover,
	onEmailSent,
}: {
	clientDataPromise?: Promise<{ client_email: string; client_name: string }>
	clientName?: string
	clientEmail?: string
	popover?: boolean
	onEmailSent?: (success?: boolean) => void
}) {
	let clientName = propClientName
	let clientEmail = propClientEmail

	// If direct props not provided, but a promise is, await it
	if ((!clientName || !clientEmail) && clientDataPromise) {
		const { client_email, client_name } = await clientDataPromise
		clientName = clientName || decodeURIComponent(client_name)
		clientEmail = clientEmail || decodeURIComponent(client_email)
	}

	const isGroupEmail = !clientEmail && !clientName

	return (
		<FormContainer popover={popover}>
			<FormHeader
				text={
					isGroupEmail
						? 'Send a group email to your clients'
						: `Send an Email to ${clientName ?? 'Client'}`
				}
			/>

			<form className="flex w-full flex-col gap-4">
				<SendEmailInputs />

				<div className="flex w-full justify-center">
					{isGroupEmail || !clientEmail ? (
						<SendNewsLetterButton />
					) : (
						<SendClientEmailButton
							clientEmail={clientEmail}
							onEmailSent={onEmailSent}
						/>
					)}
				</div>
			</form>

			{popover && (
				<div className="flex w-full justify-center">
					<Button onClick={() => onEmailSent?.(false)} type="button">
						Cancel
					</Button>
				</div>
			)}
		</FormContainer>
	)
}
