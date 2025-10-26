// DynamicFields.tsx

import type {
	FieldArrayWithId,
	UseFieldArrayAppend,
	UseFormReturn,
} from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import type { schemaUpdateStatement } from '@/lib/zod/schemas'
import { FormInput } from '../../forms/form'

type FormValues = z.infer<typeof schemaUpdateStatement>

interface DynamicFieldsProps {
	fields: FieldArrayWithId<FormValues, 'lines', 'id'>[]
	append: UseFieldArrayAppend<FormValues, 'lines'>
	remove: (index: number) => void
	form: UseFormReturn<FormValues>
	name: 'lines'
	labels: {
		description: string
		amount: string
		quantity: string
	}
}

export function DynamicFields({
	fields,
	append,
	remove,
	form,
	name,
	labels,
}: DynamicFieldsProps) {
	return (
		<FieldGroup>
			{fields.map((field, index) => (
				<div
					className="flex flex-col gap-4 border p-4 rounded-sm"
					key={field.id}
				>
					<FormInput
						control={form.control}
						label={labels.description}
						name={`${name}.${index}.description`}
					/>
					<FormInput
						control={form.control}
						label={labels.amount}
						name={`${name}.${index}.amount`}
						type="number"
					/>
					<FormInput
						control={form.control}
						label={labels.quantity}
						name={`${name}.${index}.quantity`}
						type="number"
					/>
					{fields.length > 1 && (
						<Button
							className=" w-30"
							onClick={() => remove(index)}
							type="button"
							variant="destructive"
						>
							Remove
						</Button>
					)}
				</div>
			))}
			<Button
				className=" w-30"
				onClick={() =>
					append({ description: '', amount: 0, quantity: 1 })
				}
				type="button"
			>
				Add Line
			</Button>
		</FieldGroup>
	)
}
