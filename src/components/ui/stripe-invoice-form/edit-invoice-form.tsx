'use client';

import React from 'react';
import { useUpdateStripeInvoice } from '@/lib/mutations/mutations';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaUpdateInvoice } from '@/lib/zod/schemas';
import Spinner from '../spinner';
import { StripeInvoice } from '@/types/types-stripe';

export function EditInvoiceForm({  invoice }: {  invoice: StripeInvoice }) {
    const { mutate, isPending, isSuccess, isError, data, error } = useUpdateStripeInvoice();

    const { register, watch, control, formState: { errors } } = useForm({
        resolver: zodResolver(schemaUpdateInvoice),
        defaultValues: {
            invoiceId: invoice.id || '',
            lines: invoice.lines.data.map(line => ({
                description: line.description || '',
                amount: line.amount /10,// /10 for display
                quantity: line.quantity,
            })),
                    }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "lines",
    });

    const inputClassName = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";

    const lines = watch('lines');

    const subtotal = lines.reduce((acc, line) => {
        return acc + ((line.amount ?? 0) * (line.quantity ?? 0));
    }, 0);

    return (
        <>
            <form action={mutate} className="space-y-4">               
                <input type="hidden" {...register('invoiceId')} value={invoice.id} />

                <section>
                    <h3 className="text-md font-semibold mb-2">Invoice Lines</h3>
                    {fields.map((item, index) => (
                        <div key={item.id} className="border p-4 mb-4 rounded-md">
                            <div>
                                <label htmlFor={`lines.${index}.description`} className="block text-sm font-medium text-gray-700">Description:</label>
                                <input
                                    type="text"
                                    id={`lines.${index}.description`}
                                    {...register(`lines.${index}.description`)}
                                    className={inputClassName}
                                    aria-invalid={errors.lines?.[index]?.description ? "true" : "false"}
                                />
                                {errors.lines?.[index]?.description && <p className="text-red-500 text-sm mt-1">{errors.lines[index].description.message}</p>}
                            </div>
                            <div>
                                <label htmlFor={`lines.${index}.amount`} className="block text-sm font-medium text-gray-700">Amount (per unit):</label>
                                <input
                                    type="number"
                                    id={`lines.${index}.amount`}
                                    {...register(`lines.${index}.amount`, {
                                        valueAsNumber: true
                                    })}
                                    className={inputClassName}
                                    min="0"
                                    step="0.01"
                                    aria-invalid={errors.lines?.[index]?.amount ? "true" : "false"}
                                />
                                {errors.lines?.[index]?.amount && <p className="text-red-500 text-sm mt-1">{errors.lines[index].amount.message}</p>}
                            </div>
                            <div>
                                <label htmlFor={`lines.${index}.quantity`} className="block text-sm font-medium text-gray-700">Quantity:</label>
                                <input
                                    type="number"
                                    id={`lines.${index}.quantity`}
                                    {...register(`lines.${index}.quantity`, {
                                        valueAsNumber: true
                                    })}
                                    className={inputClassName}
                                    min="1"
                                    step="1"
                                    aria-invalid={errors.lines?.[index]?.quantity ? "true" : "false"}
                                />
                                {errors.lines?.[index]?.quantity && <p className="text-red-500 text-sm mt-1">{errors.lines[index].quantity.message}</p>}
                            </div>
                            {fields.length > 1 && (
                                <Button type="button" onClick={() => remove(index)} className="mt-2">
                                    Remove Line
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button
                        type="button"
                        onClick={() => append({ description: '', amount: 0, quantity: 1 })}
                        className="mt-2"
                    >
                        Add Line
                    </Button>
                </section>

                <section>
                    <h3 className="text-md font-semibold mb-2">Totals</h3>
                    <p className="font-bold">Grand Total: ${subtotal.toFixed(2)}</p>
                </section>

                <Button variant="outline"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? <>Updating Invoice...<Spinner /></> : 'Update Invoice'}
                </Button>
            </form>

            {isSuccess && data &&
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                    <p>Invoice updated successfully!</p>
                </div>
            }

            {isError && error &&
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                    <p>Error updating invoice:</p>
                    <p>{error.message}</p>
                </div>
            }
        </>
    );
}
