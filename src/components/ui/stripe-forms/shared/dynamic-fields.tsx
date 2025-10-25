// DynamicFields.tsx
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { FormInput } from '../../forms/form'


interface DynamicFieldsProps {
	fields: any[]
	append: (item: any) => void
	remove: (index: number) => void
	form: any
	name: string
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
				<div key={field.id}>
					<FormInput
						control={form.control}
						label={labels.description}
						name={`${name}.${index}.description`}
					/>
					<FormInput
						control={form.control}
						label={labels.amount}
						name={`${name}.${index}.amount`}
						// type="number"
					/>
					<FormInput
						control={form.control}
						label={labels.quantity}
						name={`${name}.${index}.quantity`}
						// valueAsNumber
					/>
					{fields.length > 1 && (
						<Button
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
