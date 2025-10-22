'use client'
import { useMarkQuote } from '@/lib/mutations/mutations'
import { Button } from '../button'
import { MarkQuoteProps } from '@/types/stripe-types'
import EllipsisSpinner from '../loaders/EllipsisSpinner'
import { Ban, Check, Send } from 'lucide-react'
import EditQuoteLink from '../links/edit-quote-link'

export default function ManageQuoteButton({ quoteId, action }: MarkQuoteProps) {
	const { mutate, isPending } = useMarkQuote()

	const buttonText =
		action === 'accept' ? (
			<>
				<Check />
				Mark Accepted
			</>
		) : action === 'send' ? (
			<>
				<Send />
				Send
			</>
		) : (
			<>
				<Ban />
				Mark Canceled
			</>
		)

	if (action === 'edit') return <EditQuoteLink quoteId={quoteId} />
	return (
		<Button
			variant="outline"
			disabled={isPending}
			onClick={() => mutate({ action, quoteId })}
		>
			{buttonText}
			{isPending && <EllipsisSpinner />}
		</Button>
	)
}
