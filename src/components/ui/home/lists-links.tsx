'use client'
import Link from 'next/link'

export default function ListsLinks() {
	const date = new Date()
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const today = `${year}-${month}-${day}`
	return (
		<li>
			Order or reorder your route between clients homes, easily see your
			clients on a map with a link to google maps on your{' '}
			<Link
				className="text-blue-500 underline"
				href={`/lists/cutting?date=${today}`}
			>
				Cutting List
			</Link>{' '}
			or{' '}
			<Link
				className="text-blue-500 underline"
				href={`/lists/clearing?date=${today}`}
			>
				Clearing List
			</Link>
			.
		</li>
	)
}
