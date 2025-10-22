'use client'
import { Ban, Check, Send } from 'lucide-react'
import { useMarkQuote } from '@/lib/mutations/mutations'
import type { MarkQuoteProps } from '@/types/stripe-types'
import { Button } from '../button'
import EditQuoteLink from '../links/edit-quote-link'
import EllipsisSpinner from '../loaders/EllipsisSpinner'

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
			disabled={isPending}
			onClick={() => mutate({ action, quoteId })}
			variant="outline"
		>
			{buttonText}
			{isPending && <EllipsisSpinner />}
		</Button>
	)
}
