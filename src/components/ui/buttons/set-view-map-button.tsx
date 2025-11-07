'use client'

export default function SetViewMapButton({
	children,
	setFunction,
	functionText,
}: {
	children: React.ReactNode
	setFunction: React.Dispatch<React.SetStateAction<string>>
	functionText: string
}) {
	return (
		<button
			className="h-full w-[45%] cursor-pointer select-none rounded-md border border-gray-300 bg-white px-6 py-2 shadow-sm transition duration-300 ease-in-out hover:bg-green-200"
			onClick={() => setFunction(functionText)}
			type="button"
		>
			{children}
		</button>
	)
}
