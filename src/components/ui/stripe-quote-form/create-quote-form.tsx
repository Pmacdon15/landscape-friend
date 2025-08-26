'use client';

import React from 'react';
import { useCreateStripeQuote } from '@/lib/mutations/mutations';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaCreateQuote } from '@/lib/zod/schemas';
import { useCreateQuoteForm } from '@/lib/hooks/hooks';
import Spinner from '../spinner';

export function CreateQuoteForm({ organizationId }: { organizationId: string }) {
    const { mutate, isPending, isSuccess, isError, data, error } = useCreateStripeQuote();

    const { register, watch, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schemaCreateQuote),
        defaultValues: {
            labourCostPerUnit: 0,
            labourUnits: 0,
            materials: [{ materialType: '', materialCostPerUnit: 0, materialUnits: 0 }],
            organization_id: organizationId,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "materials",
    });

    useCreateQuoteForm({ isSuccess, reset, fields, append });

    const inputClassName = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";

    const labourCostPerUnit = watch('labourCostPerUnit') ?? 0;
    const labourUnits = watch('labourUnits') ?? 0;

    const materials = watch('materials');

    const materialSubtotal = materials.reduce((acc, material) => {
        return acc + ((material.materialCostPerUnit ?? 0) * (material.materialUnits ?? 0));
    }, 0);

    const subtotal = (labourCostPerUnit * labourUnits) + materialSubtotal;

    return (
        <>
            <form action={mutate} className="space-y-4">
                <input type="hidden" {...register('organization_id')} value={organizationId} />
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
                    <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number:</label>
                        <input
                            type="text"
                            id="phone_number"
                            {...register('phone_number')}
                            className={inputClassName}
                            aria-invalid={errors.phone_number ? "true" : "false"}
                        />
                        {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
                        <input
                            type="text"
                            id="address"
                            {...register('address')}
                            className={inputClassName}
                            aria-invalid={errors.address ? "true" : "false"}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>
                </section>

                <section>
                    <h3 className="text-md font-semibold mb-2">Cost Details</h3>
                    <div>
                        <label htmlFor="labourCostPerUnit" className="block text-sm font-medium text-gray-700">Labour Cost (per unit):</label>
                        <input
                            type="number"
                            id="labourCostPerUnit"
                            {...register('labourCostPerUnit', {
                                valueAsNumber: true
                            })}
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
                            {...register('labourUnits', {
                                valueAsNumber: true
                            })}
                            className={inputClassName}
                            min="1"
                            step="1"
                            aria-invalid={errors.labourUnits ? "true" : "false"}
                        />
                        {errors.labourUnits && <p className="text-red-500 text-sm mt-1">{errors.labourUnits.message}</p>}
                    </div>

                    <h4 className="text-md font-semibold mt-4 mb-2">Materials</h4>
                    {fields.map((item, index) => (
                        <div key={item.id} className="border p-4 mb-4 rounded-md">
                            <div>
                                <label htmlFor={`materials.${index}.materialType`} className="block text-sm font-medium text-gray-700">Material Type:</label>
                                <input
                                    type="text"
                                    id={`materials.${index}.materialType`}
                                    {...register(`materials.${index}.materialType`)}
                                    className={inputClassName}
                                    aria-invalid={errors.materials?.[index]?.materialType ? "true" : "false"}
                                />
                                {errors.materials?.[index]?.materialType && <p className="text-red-500 text-sm mt-1">{errors.materials[index].materialType.message}</p>}
                            </div>
                            <div>
                                <label htmlFor={`materials.${index}.materialCostPerUnit`} className="block text-sm font-medium text-gray-700">Material Cost (per unit):</label>
                                <input
                                    type="number"
                                    id={`materials.${index}.materialCostPerUnit`}
                                    {...register(`materials.${index}.materialCostPerUnit`, {
                                        valueAsNumber: true
                                    })}
                                    className={inputClassName}
                                    min="0"
                                    step="0.01"
                                    aria-invalid={errors.materials?.[index]?.materialCostPerUnit ? "true" : "false"}
                                />
                                {errors.materials?.[index]?.materialCostPerUnit && <p className="text-red-500 text-sm mt-1">{errors.materials[index].materialCostPerUnit.message}</p>}
                            </div>
                            <div>
                                <label htmlFor={`materials.${index}.materialUnits`} className="block text-sm font-medium text-gray-700">Material Units:</label>
                                <input
                                    type="number"
                                    id={`materials.${index}.materialUnits`}
                                    {...register(`materials.${index}.materialUnits`, {
                                        valueAsNumber: true
                                    })}
                                    className={inputClassName}
                                    min="1"
                                    step="1"
                                    aria-invalid={errors.materials?.[index]?.materialUnits ? "true" : "false"}
                                />
                                {errors.materials?.[index]?.materialUnits && <p className="text-red-500 text-sm mt-1">{errors.materials[index].materialUnits.message}</p>}
                            </div>
                            {fields.length > 1 && (
                                <Button type="button" onClick={() => remove(index)} className="mt-2">
                                    Remove Material
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button
                        type="button"
                        onClick={() => append({ materialType: '', materialCostPerUnit: 0, materialUnits: 0 })}
                        className="mt-2"
                    >
                        Add Material
                    </Button>
                </section>

                <section>
                    <h3 className="text-md font-semibold mb-2">Estimated Totals</h3>
                    <p>Labour Cost: ${(labourCostPerUnit * labourUnits).toFixed(2)}</p>
                    <p>Material Cost: ${materialSubtotal.toFixed(2)}</p>
                    <p className="font-bold">Grand Total: ${subtotal.toFixed(2)}</p>
                </section>

                <Button variant="outline"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? <>Creating Quote...<Spinner /></> : 'Create Quote'}
                </Button>
            </form>

            {isSuccess && data &&
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                    <p>Quote created successfully!</p>
                    <p>Quote ID: {data.quoteId}</p>
                </div>
            }

            {isError && error &&
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                    <p>Error creating quote:</p>
                    <p>{error.message}</p>
                </div>
            }
        </>
    );
}
