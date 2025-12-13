'use client'
import { useSendEmailWithTemplate } from '@/lib/mutations/mutations'
import { Button } from '../button'

export default function SendClientEmailButton({
	clientEmail,
	onEmailSent,
}: {
	clientEmail: string
	onEmailSent?: () => void
}) {
	const { mutate, isPending } = useSendEmailWithTemplate({
		clientEmail,
		onSuccess: () => {
			onEmailSent?.()
		},
	})

	if (clientEmail.length > 0) {
		return <div>No clients to send email to</div>
	}

	return (
		<Button
			disabled={isPending}
			formAction={(formData) => mutate(formData)}
			variant={'outline'}
		>
			Send
		</Button>
	)
}
