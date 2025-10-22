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
	const formattedText = text2.split('\n').map((line, _i) => (
		<span key={line}>
			{' '}
			{line}
			<br />
		</span>
	))

	return (
		<>
			<h2 className="text-xl font-semibold mt-6 mb-2">{title}</h2>
			<p className="mb-4">
				{formattedText}
				{email && (
					<Link
						className="underline text-blue-600"
						href="mailto:support@landscapefriend.com"
					>
						support@landscapefriend.com
					</Link>
				)}
			</p>
		</>
	)
}
