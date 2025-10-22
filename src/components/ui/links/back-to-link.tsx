import Link from 'next/link'
import { Button } from '../button'
import { Route } from 'next'

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
