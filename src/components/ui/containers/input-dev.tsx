export function InputDiv({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <div className="flex items-center gap-2 p-2">{children}</div>
}
