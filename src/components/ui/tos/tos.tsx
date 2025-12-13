import Link from 'next/link'

export function TosSection({
	title,
	text2,
	email,
}: {
	title: string
	text2: string
	email?: string
}) {
	const formattedText = text2.split('\n').map((line, i) => (
		<span key={line + i}>
			{' '}
			{line}
			<br />
		</span>
	))

	return (
		<>
			<h2 className="mt-6 mb-2 font-semibold text-xl">{title}</h2>
			<p className="mb-4">
				{formattedText}
				{email && (
					<Link
						className="text-blue-600 underline"
						href="mailto:support@landscapefriend.com"
					>
						support@landscapefriend.com
					</Link>
				)}
			</p>
		</>
	)
}
