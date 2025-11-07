export default function SettingsForm({
	children,
}: {
	children: React.ReactNode
}) {
	return <form className="flex flex-col gap-4">{children}</form>
}
