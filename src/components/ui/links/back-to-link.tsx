import type { Route } from 'next'
import Link from 'next/link'
import { Button } from '../button'

export default function BackToLink({
	path,
	place,
}: {
	path: Route
	place: string
}) {
	return (
		<Link href={path}>
			<Button variant={'outline'}>Back to {place}</Button>
		</Link>
	)
}
