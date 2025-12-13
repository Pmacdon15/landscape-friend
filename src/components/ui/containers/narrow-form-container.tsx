export default function NarrowFormContainer({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div
			className={`rounded-sm border bg-white p-1 shadow-2xl w-full md:w-3/6`}
		>
			<div className={`rounded-sm border bg-background p-1 shadow-2xl`}>
				<div className="flex w-full flex-col gap-2 rounded-sm border bg-[url('/lawn4.png')] bg-center bg-cover bg-no-repeat p-2 shadow-2xl">
					{children}
				</div>
			</div>
		</div>
	)
}
