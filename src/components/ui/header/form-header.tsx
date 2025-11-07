export default function FormHeader({
	children,
	text,
}: {
	children?: React.ReactNode
	text?: string
}) {
	return (
		<div
			className={`flex ${children && 'flex-col'} justify-center rounded-sm border bg-white/70 p-2 align-middle shadow-2xl`}
		>
			<h1 className="font-semibold text-2xl text-gray-800">{text}</h1>
			{children}
		</div>
	)
}
