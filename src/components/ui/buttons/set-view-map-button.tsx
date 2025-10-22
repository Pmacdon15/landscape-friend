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
			className="h-full  select-none cursor-pointer w-[45%] px-6 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out"
			onClick={() => setFunction(functionText)}
			type="button"
		>
			{children}
		</button>
	)
}
