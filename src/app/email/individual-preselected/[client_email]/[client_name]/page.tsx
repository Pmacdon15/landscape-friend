import { Suspense } from 'react'
import SendEmailComponent from '@/components/ui/emails/send-email-component'
export default async function Page({
	params,
}: {
	params: Promise<{ client_email: string; client_name: string }>
}) {
	'use cache'
	return (
		<Suspense>
			<SendEmailComponent clientDataPromise={params} />
		</Suspense>
	)
}
