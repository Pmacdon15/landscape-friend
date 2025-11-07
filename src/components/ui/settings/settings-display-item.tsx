import type { ReactNode } from 'react'

export default function SettingsDisplayItem({
	label,
	children,
	actions,
	id,
}: {
	label: string
	children: ReactNode
	actions: ReactNode
	id?: string
}) {
	return (
		<div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-center">
			<div className="flex w-full items-center gap-4 md:w-96">
				<label className="w-32" htmlFor={id}>
					{label}
				</label>
				<div className="flex-1">{children}</div>
			</div>
			<div className="w-full flex-1 md:w-auto">{actions}</div>
		</div>
	)
}
