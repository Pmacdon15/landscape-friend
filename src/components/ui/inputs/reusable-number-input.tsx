interface ReusableNumberInputProps {
	className?: string
	name: string
	defaultValue: number
	onChange: (value: number) => void
	disabled?: boolean
}

export default function ReusableNumberInput({
	className = ' w-16 border rounded-sm  p-1',
	name,
	defaultValue,
	onChange,
	disabled = false,
}: ReusableNumberInputProps) {
	return (
		<input
			className={className}
			defaultValue={defaultValue}
			disabled={disabled}
			name={name}
			onChange={(event) => onChange(Number(event.target.value))}
			type="number"
		/>
	)
}
