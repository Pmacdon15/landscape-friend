export default function FillFormContainer({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div
			className={
				'flex w-full flex-col gap-4 rounded-sm bg-white/70 p-6'
			}
		>
			{children}
		</div>
	)
}
