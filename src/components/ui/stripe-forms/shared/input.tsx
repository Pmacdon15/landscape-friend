// components/InputField.tsx
import React from 'react'
import {
	type FieldErrors,
	type FieldValues,
	get,
	type Path,
	type UseFormRegister,
} from 'react-hook-form'

interface InputFieldProps<TFieldValues extends FieldValues> {
	label: string
	id: string
	type: string
	register: UseFormRegister<TFieldValues>
	errors: FieldErrors<TFieldValues>
	className?: string
	min?: string | number
	step?: string | number
	valueAsNumber?: boolean
	disabled?: boolean
	list?: string
}

const InputField = <TFieldValues extends FieldValues>({
	label,
	id,
	type,
	register,
	errors,
	className = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2',
	min,
	step,
	valueAsNumber,
	disabled,
	list,
}: InputFieldProps<TFieldValues>) => {
	const error = get(errors, id)

	return (
		<div>
			<label
				className="block text-sm font-medium text-gray-700"
				htmlFor={id}
			>
				{label}
			</label>
			<input
				id={id}
				type={type}
				{...register(id as Path<TFieldValues>, { valueAsNumber })}
				aria-invalid={error ? 'true' : 'false'}
				className={className}
				disabled={disabled}
				list={list}
				min={min}
				step={step}
			/>
			{error && (
				<p className="text-red-500 text-sm mt-1">{error.message}</p>
			)}
		</div>
	)
}

export default InputField
