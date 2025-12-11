export default function PageContainer({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex flex-col items-center gap-8 p-2 pb-10 font-sans md:gap-12 md:p-4">
			{children}
		</div>
	)
}
