export default function FormContainer({
	children,
	popover = false,
}: {
	children: React.ReactNode
	popover?: boolean
}) {
	return (
		<div
			className={`rounded-sm border bg-white p-1 ${popover ? 'w-full' : 'max-sm:w-full sm:w-4/6 md:w-5/6'}  `}
		>
			<div className={`rounded-sm border bg-background p-1 shadow-lg`}>
				<div className="flex w-full flex-col gap-2 rounded-sm border bg-[url('/lawn4.png')] bg-center bg-cover bg-no-repeat p-2">
					{children}
				</div>
			</div>
		</div>
	)
}
