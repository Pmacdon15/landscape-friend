export default function ContentContainer({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div
			className={
				'flex flex-col gap-4 rounded-sm bg-white/70 p-6 shadow-lg max-sm:w-full sm:w-4/6 md:w-5/6'
			}
		>
			{children}
		</div>
	)
}
