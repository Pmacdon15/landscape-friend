export default function FormHeader({
	children,
	text,
}: {
	children?: React.ReactNode
	text?: string
}) {
	return (
		<div
			className={`flex ${children && 'flex-col'} justify-center align-middle p-2 bg-white/70 shadow-2xl border rounded-sm`}
		>
			<h1 className="text-2xl font-semibold text-gray-800">{text}</h1>
			{children}
		</div>
	)
}
