import { Suspense } from 'react'
import SendEmailInputs from '@/components/ui/emails/send-email-inputs'
import SendIndividualEmail from '@/components/ui/emails/send-individual-email'
import SendIndividualEmailFallback from '@/components/ui/fallbacks/send-individual-email-fallback'
import { fetchClientsNamesAndEmails } from '@/lib/dal/clients-dal'

export default function page() {
	const namesAndEmailsPromise = fetchClientsNamesAndEmails()
	return (
		<Suspense fallback={<SendIndividualEmailFallback />}>
			<SendIndividualEmail namesAndEmailsPromise={namesAndEmailsPromise}>
				<SendEmailInputs />
			</SendIndividualEmail>
		</Suspense>
	)
}
