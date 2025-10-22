'use client'
import { Ban, CreditCard, Send } from 'lucide-react'
import {
	useMarkInvoicePaid,
	useMarkInvoiceVoid,
	useResendInvoice,
} from '@/lib/mutations/mutations'
import { Button } from '../button'
import EllipsisSpinner from '../loaders/EllipsisSpinner'

export default function ManageInvoiceButton({
	invoiceId,
	variant,
}: {
	invoiceId?: string
	variant: 'send' | 'resend' | 'paid' | 'void'
}) {
	const { mutate: resendMutate, isPending: isResendPending } =
		useResendInvoice()
	const { mutate: paidMutate, isPending: isPaidPending } =
		useMarkInvoicePaid()
	const { mutate: voidMutate, isPending: isVoidPending } =
		useMarkInvoiceVoid()

	const handleClick = () => {
		if (!invoiceId) return
		if (variant === 'resend' || variant === 'send') {
			resendMutate(invoiceId)
		} else if (variant === 'paid') {
			paidMutate(invoiceId)
		} else if (variant === 'void') {
			voidMutate(invoiceId)
		}
	}

	const isPending =
		variant === 'paid'
			? isPaidPending
			: variant === 'void'
				? isVoidPending
				: isResendPending

	const buttonText =
		variant === 'paid' ? (
			<>
				<CreditCard />
				Mark Paid
			</>
		) : variant === 'void' ? (
			<>
				<Ban />
				Mark Void
			</>
		) : variant === 'send' ? (
			<>
				<Send />
				Send
			</>
		) : (
			<>
				<Send />
				Resend
			</>
		)

	return (
		<Button disabled={isPending} onClick={handleClick} variant="outline">
			{buttonText} {isPending && <EllipsisSpinner />}
		</Button>
	)
}
