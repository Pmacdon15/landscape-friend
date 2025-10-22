import { Edit } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../button'

export default function EditInvoiceLink({ invoiceId }: { invoiceId?: string }) {
	return (
		<Link
			href={`/billing/edit/invoice?invoice=${invoiceId}`}
			prefetch={false}
		>
			<Button variant={'outline'}>
				<Edit />
				Edit
			</Button>
		</Link>
	)
}
