'use client'

import { useCancelSubscription } from '@/lib/mutations/mutations'
import { Button } from '../button'
import EllipsisSpinner from '../loaders/EllipsisSpinner'

export default function CancelSubscriptionButton({
	subscriptionId,
}: {
	subscriptionId: string
}) {
	const { mutate: cancelSubscription, isPending } = useCancelSubscription()
	return (
		<div className="mt-4">
			<Button
				disabled={isPending}
				onClick={() => cancelSubscription(subscriptionId)}
				variant="destructive"
			>
				{isPending ? (
					<>
						Cancelling <EllipsisSpinner />
					</>
				) : (
					'Cancel Subscription'
				)}
			</Button>
		</div>
	)
}
