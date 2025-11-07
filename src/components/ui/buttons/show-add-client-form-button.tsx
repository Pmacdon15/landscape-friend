import type { Props } from '@/types/params-types'

export default function ShowAddClientFormButton({
	showForm,
	setShowForm,
}: Props) {
	return (
		<button
			className={`ml-auto h-9 rounded-sm border px-4 py-2 has-[>svg]:px-3 ${!showForm ? 'bg-background hover:bg-background/60' : 'bg-red-400 hover:bg-red-300'} shadow-lg`}
			onClick={() => setShowForm((prev) => !prev)}
			type="button"
		>
			{!showForm ? 'Add Client' : 'Cancel'}
		</button>
	)
}
