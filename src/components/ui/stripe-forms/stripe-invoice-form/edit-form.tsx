'use client';
import React from 'react';
import { useUpdateStripeDocument } from '@/lib/mutations/mutations';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaUpdateStatement } from '@/lib/zod/schemas';
import Spinner from '../../loaders/spinner';
import { AlertMessage } from '../shared/alert-message';
import { DynamicFields } from '../shared/dynamic-fields'; // our reusable component
import { z } from 'zod';
import { useResetFormOnSuccess } from '@/lib/hooks/hooks';
import BackToLink from '../../links/back-to-link';
import { EditStripeForm } from '@/types/stripe-types';

export function EditForm({ invoiceOrQuote }: { invoiceOrQuote: EditStripeForm }) {
    const { mutate, isPending, isSuccess, isError, data, error } = useUpdateStripeDocument();

    const { register, watch, control, handleSubmit, reset, formState: { errors } } = useForm<z.input<typeof schemaUpdateStatement>>({
        resolver: zodResolver(schemaUpdateStatement),
        defaultValues: {
            id: invoiceOrQuote.id || '',
            lines: (invoiceOrQuote.lines?.data || []).map(line => ({
                description: line.description || '',
                amount: line.amount,
                quantity: line.quantity,
            })),
        } as z.input<typeof schemaUpdateStatement>,
    });

    const submittedData = React.useRef<z.input<typeof schemaUpdateStatement> | null>(null);

    useResetFormOnSuccess(isSuccess, submittedData, reset);

    const { fields, append, remove } = useFieldArray({ control, name: 'lines' });

    const watchedLines = watch('lines');
    const subtotal = watchedLines?.reduce((acc, item) => acc + (Number(item.amount) * Number(item.quantity)), 0) ?? 0;

    const onSubmit: SubmitHandler<z.input<typeof schemaUpdateStatement>> = (formData) => {
        submittedData.current = formData;
        mutate(formData as z.infer<typeof schemaUpdateStatement>)
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" {...register('id')} value={invoiceOrQuote.id} />

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

                <div>
                    <Button variant="outline" type="submit" disabled={isPending}>
                        {isPending ? <>Updating document...<Spinner /></> : 'Update Document'}
                    </Button>
                </div>

                <BackToLink path={'/billing/manage/invoices'} place={'Invoices'} />

            </form>

            {/* Reusable Alerts */}
            {isSuccess && data && <AlertMessage type="success" message="Invoice updated successfully!" />}
            {isError && error && <AlertMessage type="error" message={`Error updating invoice: ${error.message}`} />}
        </>
    );
}
