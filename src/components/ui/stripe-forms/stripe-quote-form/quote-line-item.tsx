'use client'

import { useEffect } from 'react'
import {
	type Control,
	type FieldErrors,
	type UseFormRegister,
	type UseFormSetValue,
	useWatch,
} from 'react-hook-form'
import type Stripe from 'stripe'
import type { z } from 'zod'
import { useProductPrice } from '@/lib/hooks/useStripe'
import type { schemaCreateQuote } from '@/lib/zod/schemas'
import InputField from '../shared/input'

interface QuoteLineItemProps {
	index: number
	control: Control<z.infer<typeof schemaCreateQuote>>
	register: UseFormRegister<z.infer<typeof schemaCreateQuote>>
	errors: FieldErrors<z.infer<typeof schemaCreateQuote>>
	setValue: UseFormSetValue<z.infer<typeof schemaCreateQuote>>
	products: Stripe.Product[] | undefined
}

export const QuoteLineItem = ({
	index,
	control,
	register,
	errors,
	setValue,
	products,
}: QuoteLineItemProps) => {
	const materialType = useWatch({
		control,
		name: `materials.${index}.materialType`,
	})

	const selectedProduct = products?.find((p) => p.name === materialType)
	const { data: price, isLoading } = useProductPrice(
		selectedProduct?.id || null,
	)

	useEffect(() => {
		if (price?.unit_amount) {
			setValue(
				`materials.${index}.materialCostPerUnit`,
				price.unit_amount / 100,
			)
		}
	}, [price, index, setValue])

	return (
		<div className="border p-4 mb-4 rounded-md">
			<div>
				<InputField
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
					errors={errors}
					id={`materials.${index}.materialType`}
					label="Material"
					list={`materials-list-${index}`}
					register={register}
					type="text"
				/>
				<datalist id={`materials-list-${index}`}>
					{products?.map((product) => (
						<option key={product.id} value={product.name} />
					))}
				</datalist>
			</div>

			<InputField
				className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
				disabled={isLoading}
				errors={errors}
				id={`materials.${index}.materialCostPerUnit`}
				label="Material Cost (per unit)"
				min="0"
				register={register}
				step="0.01"
				type="number"
				valueAsNumber
			/>

			<InputField
				className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
				errors={errors}
				id={`materials.${index}.materialUnits`}
				label="Material Units"
				min="1"
				register={register}
				step="1"
				type="number"
				valueAsNumber
			/>
		</div>
	)
}
