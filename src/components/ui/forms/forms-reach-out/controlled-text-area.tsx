'use client'

import type { Control, FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

interface ControlledTextAreaProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
	label: string
	placeholder?: string
}

export function ControlledTextArea<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
}: ControlledTextAreaProps<T>) {
	const id = `form-get-a-quote-${name}`
	return (
		<FieldGroup>
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={id}>{label}</FieldLabel>
						<Textarea
							{...field}
							aria-invalid={fieldState.invalid}
							autoComplete="off"
							id={id}
							placeholder={placeholder}
						/>
						{fieldState.invalid && (
							<FieldError errors={[fieldState.error]} />
						)}
					</Field>
				)}
			/>
		</FieldGroup>
	)
}
