import Link from 'next/link'
import { Button } from '../button'

export default function BackToDocsLink() {
	return (
		<Link className="mx-auto mt-auto" href="/documentation">
			<Button variant="outline">Back To Documentation</Button>
		</Link>
	)
}
