export default function ListViewWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex h-[300px] min-h-[300px] w-full flex-col overflow-y-auto rounded-md bg-background p-2">
			{children}
		</div>
	)
}
