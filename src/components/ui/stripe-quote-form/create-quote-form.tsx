'use client';

import React from 'react';
import { useCreateStripeQuote } from '@/mutations/mutations';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaCreateQuote } from '@/lib/zod/schemas';

export function CreateQuoteForm() {
    const { mutate, isPending, isSuccess, isError, data, error } = useCreateStripeQuote();

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schemaCreateQuote),
    });

    const inputClassName = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";

    const labourCostPerUnit = watch('labourCostPerUnit');
    const labourUnits = watch('labourUnits');
    const materialCostPerUnit = watch('materialCostPerUnit');
    const materialUnits = watch('materialUnits');

    const subtotal = (labourCostPerUnit * labourUnits) + (materialCostPerUnit * materialUnits);


    return (
        <>
            <form action={mutate} className="space-y-4">
                <section>
                    <h3 className="text-md font-semibold mb-2">Client Information</h3>
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name:</label>
                        <input
                            type="text"
                            id="clientName"
                            {...register('clientName')}
                            className={inputClassName}
                            aria-invalid={errors.clientName ? "true" : "false"}
                        />
                        {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Client Email:</label>
                        <input
                            type="email"
                            id="clientEmail"
                            {...register('clientEmail')}
                            className={inputClassName}
                            aria-invalid={errors.clientEmail ? "true" : "false"}
                        />
                        {errors.clientEmail && <p className="text-red-500 text-sm mt-1">{errors.clientEmail.message}</p>}
                    </div>
                </section>

                <section>
                    <h3 className="text-md font-semibold mb-2">Cost Details</h3>
                    <div>
                        <label htmlFor="labourCostPerUnit" className="block text-sm font-medium text-gray-700">Labour Cost (per unit):</label>
                        <input
                            type="number"
                            id="labourCostPerUnit"
                            {...register('labourCostPerUnit')}
                            className={inputClassName}
                            min="0"
                            step="0.01"
                            aria-invalid={errors.labourCostPerUnit ? "true" : "false"}
                        />
                        {errors.labourCostPerUnit && <p className="text-red-500 text-sm mt-1">{errors.labourCostPerUnit.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="labourUnits" className="block text-sm font-medium text-gray-700">Labour Units:</label>
                        <input
                            type="number"
                            id="labourUnits"
                            {...register('labourUnits')}
                            className={inputClassName}
                            min="1"
                            step="1"
                            aria-invalid={errors.labourUnits ? "true" : "false"}
                        />
                        {errors.labourUnits && <p className="text-red-500 text-sm mt-1">{errors.labourUnits.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="materialType" className="block text-sm font-medium text-gray-700">Material Type:</label>
                        <input
                            type="text"
                            id="materialType"
                            {...register('materialType')}
                            className={inputClassName}
                            aria-invalid={errors.materialType ? "true" : "false"}
                        />
                        {errors.materialType && <p className="text-red-500 text-sm mt-1">{errors.materialType.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="materialCostPerUnit" className="block text-sm font-medium text-gray-700">Material Cost (per unit):</label>
                        <input
                            type="number"
                            id="materialCostPerUnit"
                            {...register('materialCostPerUnit')}
                            className={inputClassName}
                            min="0"
                            step="0.01"
                            aria-invalid={errors.materialCostPerUnit ? "true" : "false"}
                        />
                        {errors.materialCostPerUnit && <p className="text-red-500 text-sm mt-1">{errors.materialCostPerUnit.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="materialUnits" className="block text-sm font-medium text-gray-700">Material Units:</label>
                        <input
                            type="number"
                            id="materialUnits"
                            {...register('materialUnits')}
                            className={inputClassName}
                            min="1"
                            step="1"
                            aria-invalid={errors.materialUnits ? "true" : "false"}
                        />
                        {errors.materialUnits && <p className="text-red-500 text-sm mt-1">{errors.materialUnits.message}</p>}
                    </div>
                </section>

                <section>
                    <h3 className="text-md font-semibold mb-2">Estimated Totals</h3>
                    <p>Labour Cost: ${(labourCostPerUnit * labourUnits).toFixed(2)}</p>
                    <p>Material Cost: ${(materialCostPerUnit * materialUnits).toFixed(2)}</p>
                    <p className="font-bold">Grand Total: ${subtotal.toFixed(2)}</p>
                </section>

                <Button variant="outline"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? 'Creating Quote...' : 'Create Quote'}
                </Button>
            </form>

            {
                isSuccess && data && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                        <p>Quote created successfully!</p>
                        <p>Quote ID: {data.quoteId}</p>
                    </div>
                )
            }

            {
                isError && error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                        <p>Error creating quote:</p>
                        <p>{error.message}</p>
                    </div>
                )
            }
        </>
    );
}