'use client';

import { useProductPrice } from '@/lib/hooks/useStripe';
import { useEffect } from 'react';
import { useWatch, Control, UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import InputField from '../shared/input';
import Stripe from 'stripe';
import { z } from 'zod';
import { schemaCreateQuote } from '@/lib/zod/schemas';

interface QuoteLineItemProps {
    index: number;
    control: Control<z.infer<typeof schemaCreateQuote>>;
    register: UseFormRegister<z.infer<typeof schemaCreateQuote>>;
    errors: FieldErrors<z.infer<typeof schemaCreateQuote>>;
    setValue: UseFormSetValue<z.infer<typeof schemaCreateQuote>>;
    products: Stripe.Product[] | undefined;
}

export const QuoteLineItem = ({ index, control, register, errors, setValue, products }: QuoteLineItemProps) => {
    const materialType = useWatch({
        control,
        name: `materials.${index}.materialType`,
    });

    const selectedProduct = products?.find(p => p.name === materialType);
    const { data: price, isLoading } = useProductPrice(selectedProduct?.id || null);

    useEffect(() => {
        if (price && price.unit_amount) {
            setValue(`materials.${index}.materialCostPerUnit`, price.unit_amount / 100);
        }
    }, [price, index, setValue]);

    return (
        <div className="border p-4 mb-4 rounded-md">
            <div>
                <InputField
                    label="Material"
                    id={`materials.${index}.materialType`}
                    type="text"
                    register={register}
                    errors={errors}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    list={`materials-list-${index}`}
                />
                <datalist id={`materials-list-${index}`}>
                    {products?.map(product => (
                        <option key={product.id} value={product.name} />
                    ))}
                </datalist>
            </div>

            <InputField
                label="Material Cost (per unit)"
                id={`materials.${index}.materialCostPerUnit`}
                type="number"
                register={register}
                errors={errors}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="0"
                step="0.01"
                valueAsNumber
                disabled={isLoading}
            />

            <InputField
                label="Material Units"
                id={`materials.${index}.materialUnits`}
                type="number"
                register={register}
                errors={errors}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1"
                step="1"
                valueAsNumber
            />
        </div>
    );
};
