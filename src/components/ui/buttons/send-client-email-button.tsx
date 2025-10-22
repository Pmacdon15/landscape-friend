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

	if (!clientEmail.length) {
		return <div>No clients to send email to</div>
	}

	return (
		<Button
			formAction={(formData) => mutate(formData)}
			disabled={isPending}
			variant={'outline'}
		>
			Send
		</Button>
	)
}
