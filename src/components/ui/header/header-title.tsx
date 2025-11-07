export default function HeaderTitle({ text }: { text: string }) {
	return (
		<div className="flex w-full justify-center rounded-sm border bg-white/30 p-2 text-center align-middle shadow-xl">
			<h1 className="overflow-hidden break-words text-center text-gray-800 text-lg md:text-4xl">
				{text}
			</h1>
		</div>
	)
}
