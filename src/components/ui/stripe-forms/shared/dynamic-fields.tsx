'use client'
import type {
	Control,
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form'
import type Stripe from 'stripe'
import { Button } from '@/components/ui/button'
import InputField from './input' // adjust path if needed

type FieldWithId<T> = T & { id: string }

interface DynamicFieldsProps<T, TFieldValues extends FieldValues> {
	name: string // "lines" or "materials"
	fields: FieldWithId<T>[]
	append: (item: T | T[]) => void
	remove: (index: number) => void
	register: UseFormRegister<TFieldValues>
	errors: FieldErrors<TFieldValues>
	control: Control<TFieldValues>
	labels: { description: string; amount: string; quantity: string } // customizable labels
	newItem: () => T
	products?: Stripe.Product[]
}

export function DynamicFields<
	T extends {
		description?: string
		amount?: number | unknown
		quantity?: number | unknown
		materialType?: string
		materialCostPerUnit?: number
		materialUnits?: number
	},
	TFieldValues extends FieldValues,
>({
	name,
	fields,
	append,
	remove,
	register,
	errors,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	control,
	labels,
	newItem,
	products,
}: DynamicFieldsProps<T, TFieldValues>) {
	return (
		<section>
			<h3 className="text-md font-semibold mb-2">
				{labels.description} Items
			</h3>
			{fields.map((item, index: number) => (
				<div className="border p-4 mb-4 rounded-md" key={item.id}>
					{item.description !== undefined && (
						<InputField
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
							errors={errors}
							id={`${name}.${index}.description`}
							label={labels.description}
							register={register}
							type="text"
						/>
					)}
					{item.materialType !== undefined && (
						<div>
							<InputField
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
								errors={errors}
								id={`${name}.${index}.materialType`}
								label={labels.description}
								list={`${name}-list-${index}`}
								register={register}
								type="text"
							/>
							<datalist id={`${name}-list-${index}`}>
								{products?.map((product) => (
									<option
										key={product.id}
										value={product.name}
									/>
								))}
							</datalist>
						</div>
					)}

					<InputField
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						errors={errors}
						id={`${name}.${index}.${item.amount !== undefined ? 'amount' : 'materialCostPerUnit'}`}
						label={labels.amount}
						min="0"
						register={register}
						step="0.01"
						type="number"
						valueAsNumber
					/>

					<InputField
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						errors={errors}
						id={`${name}.${index}.${item.quantity !== undefined ? 'quantity' : 'materialUnits'}`}
						label={labels.quantity}
						min="1"
						register={register}
						step="1"
						type="number"
						valueAsNumber
					/>

					{fields.length > 1 && (
						<Button
							className="mt-2"
							onClick={() => remove(index)}
							type="button"
						>
							Remove {labels.description} Item
						</Button>
					)}
				</div>
			))}

			<Button
				className="mt-2"
				onClick={() => append(newItem())}
				type="button"
			>
				Add {labels.description} Item
			</Button>
		</section>
	)
}
