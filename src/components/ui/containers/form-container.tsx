export default function FormContainer({
	children,
	popover = false,
}: {
	children: React.ReactNode
	popover?: boolean
}) {
	return (
		<div
			className={`rounded-sm border bg-white shadow-2xl p-1 ${popover ? 'w-full' : 'max-sm:w-full sm:w-4/6 md:w-5/6'}  `}
		>
			<div className={`bg-background p-1 rounded-sm border shadow-2xl`}>
				<div className="flex w-full flex-col gap-2 rounded-sm border bg-[url('/lawn3.jpg')] bg-center bg-cover bg-no-repeat p-2 shadow-2xl">
					{children}
				</div>
			</div>
		</div>
	)
}
