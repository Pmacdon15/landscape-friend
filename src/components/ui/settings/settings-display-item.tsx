import { ReactNode } from 'react'

export default function SettingsDisplayItem({
	label,
	children,
	actions,
}: {
	label: string
	children: ReactNode
	actions: ReactNode
}) {
	return (
		<div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
			<div className="flex w-full md:w-96 items-center gap-4">
				<label className="w-32 ">{label}</label>
				<div className="flex-1">{children}</div>
			</div>
			<div className="flex-1 w-full md:w-auto ">{actions}</div>
		</div>
	)
}
