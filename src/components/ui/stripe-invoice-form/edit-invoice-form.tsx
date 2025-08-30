'use client';
import React from 'react';
import { useUpdateStripeInvoice } from '@/lib/mutations/mutations';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaUpdateInvoice } from '@/lib/zod/schemas';
import Spinner from '../spinner';
import { StripeInvoice } from '@/types/types-stripe';
import { AlertMessage } from '../stripe-forms/shared/alert-message';
import { DynamicFields } from '../stripe-forms/shared/dynamic-fields'; // our reusable component
import { z } from 'zod';

export function EditInvoiceForm({ invoice }: { invoice: StripeInvoice }) {
    const { mutate, isPending, isSuccess, isError, data, error } = useUpdateStripeInvoice();

    const { register, watch, control, handleSubmit, reset, formState: { errors } } = useForm<z.input<typeof schemaUpdateInvoice>>({
        resolver: zodResolver(schemaUpdateInvoice),
        defaultValues: {
            invoiceId: invoice.id || '',
            lines: invoice.lines.data.map(line => ({
                description: line.description || '',
                amount: line.amount,
                quantity: line.quantity,
            })),
        } as z.input<typeof schemaUpdateInvoice>,
    });

    const submittedData = React.useRef<z.input<typeof schemaUpdateInvoice> | null>(null);

    const { fields, append, remove } = useFieldArray({ control, name: 'lines' });

    const watchedLines = watch('lines');
    const subtotal = watchedLines?.reduce((acc, item) => acc + (Number(item.amount) * Number(item.quantity)), 0) ?? 0;

    const onSubmit: SubmitHandler<z.input<typeof schemaUpdateInvoice>> = (formData) => {
        submittedData.current = formData;
        mutate(formData as z.infer<typeof schemaUpdateInvoice>)
    };

    React.useEffect(() => {
        if (isSuccess && submittedData.current) {
            reset(submittedData.current);
        }
    }, [isSuccess, reset]);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" {...register('invoiceId')} value={invoice.id} />

                {/* Reusable Dynamic Fields for Invoice Lines */}
                <section>
                    <h3 className="text-md font-semibold mb-2">Invoice Lines</h3>
                    <DynamicFields
                        name="lines"
                        fields={fields}
                        append={append}
                        remove={remove}
                        register={register}
                        control={control}
                        errors={errors}
                        labels={{ description: 'Invoice Line', amount: 'Amount (per unit)', quantity: 'Quantity' }}
                        newItem={() => ({ description: '', amount: 0, quantity: 1 })}
                    />
                </section>

                <p className="font-bold mt-2">Subtotal: ${subtotal.toFixed(2)}</p>

                <Button variant="outline" type="submit" disabled={isPending}>
                    {isPending ? <>Updating Invoice...<Spinner /></> : 'Update Invoice'}
                </Button>
            </form>

            {/* Reusable Alerts */}
            {isSuccess && data && <AlertMessage type="success" message="Invoice updated successfully!" />}
            {isError && error && <AlertMessage type="error" message={`Error updating invoice: ${error.message}`} />}
        </>
    );
}