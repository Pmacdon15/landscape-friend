'use client'
import { useUpdateStripeAPIKey } from '@/lib/mutations/mutations'
import { Button } from '../button'
import EllipsisSpinner from '../loaders/EllipsisSpinner'

export default function UpdateStripeApiKeyButton() {
	const { mutate, isPending, isError } = useUpdateStripeAPIKey()
	return (
		<>
			<Button
				disabled={isPending}
				formAction={mutate}
				variant={'outline'}
			>
				{isPending ? (
					<>
						Updating <EllipsisSpinner />
					</>
				) : (
					'Update'
				)}
			</Button>
			{isError && <p className="text-red-500">Error Updating API Key</p>}
		</>
	)
}
