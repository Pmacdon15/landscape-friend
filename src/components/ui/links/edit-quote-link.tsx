import { Edit } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../button'

export default function EditQuoteLink({ quoteId }: { quoteId?: string }) {
	return (
		<Link href={`/billing/edit/quote?quote=${quoteId}`} prefetch={false}>
			<Button variant={'outline'}>
				<>
					<Edit />
					Edit
				</>
			</Button>
		</Link>
	)
}
