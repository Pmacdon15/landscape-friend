'use client'

import { useEffect } from 'react'
import { type Control, type UseFormSetValue, useWatch } from 'react-hook-form'
import type Stripe from 'stripe'
import type { z } from 'zod'
import { FormInput } from '@/components/ui/forms/form'
import { useProductPrice } from '@/lib/hooks/useStripe'
import type { schemaCreateQuote } from '@/lib/zod/schemas'

interface QuoteLineItemProps {
	index: number
	control: Control<z.infer<typeof schemaCreateQuote>>
	setValue: UseFormSetValue<z.infer<typeof schemaCreateQuote>>
	products: Stripe.Product[] | undefined
}

export const QuoteLineItem = ({
	index,
	control,
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
				<FormInput
					control={control}
					label="Material"
					list={`materials-list-${index}`}
					name={`materials.${index}.materialType`}
				/>
				<datalist id={`materials-list-${index}`}>
					{products?.map((product) => (
						<option key={product.id} value={product.name} />
					))}
				</datalist>
			</div>

			<FormInput
				control={control}
				disabled={isLoading}
				label="Material Cost (per unit)"
				name={`materials.${index}.materialCostPerUnit`}
				step="0.01"
				type="number"
			/>

			<FormInput
				control={control}
				label="Material Units"
				name={`materials.${index}.materialUnits`}
				type="number"
			/>
		</div>
	)
}
