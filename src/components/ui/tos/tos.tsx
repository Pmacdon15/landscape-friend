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
	// Replace newlines with <br /> for formatting
	const formattedText = text2.split('\n').map((line, i) => (
		<span key={i}>
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
						href="mailto:support@landscapefriend.com"
						className="underline text-blue-600"
					>
						support@landscapefriend.com
					</Link>
				)}
			</p>
		</>
	)
}
