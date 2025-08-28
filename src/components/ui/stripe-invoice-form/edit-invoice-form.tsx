'use client';
import React from 'react';
import { useUpdateStripeInvoice } from '@/lib/mutations/mutations';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaUpdateInvoice } from '@/lib/zod/schemas';
import Spinner from '../spinner';
import InputField from '../stripe-forms/shared/input';
import { StripeInvoice } from '@/types/types-stripe';
import { AlertMessage } from '../stripe-forms/shared/alert-message';

export function EditInvoiceForm({ invoice }: { invoice: StripeInvoice }) {
  const { mutate, isPending, isSuccess, isError, data, error } = useUpdateStripeInvoice();

  const { register, watch, control, formState: { errors } } = useForm({
    resolver: zodResolver(schemaUpdateInvoice),
    defaultValues: {
      invoiceId: invoice.id || '',
      lines: invoice.lines.data.map(line => ({
        description: line.description || '',
        amount: line.amount,
        quantity: line.quantity,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });
  const inputClassName = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";

  const lines = watch('lines');
  const subtotal = lines.reduce(
    (acc, line) => acc + ((line.amount ?? 0) * (line.quantity ?? 0)),
    0
  );

  return (
    <>
      <form action={mutate} className="space-y-4">
        <input type="hidden" {...register('invoiceId')} value={invoice.id} />

        {/* Line Items Section */}
        <section>
          <h3 className="text-md font-semibold mb-2">Invoice Lines</h3>
          {fields.map((item, index) => (
            <div key={item.id} className="border p-4 mb-4 rounded-md">
              <InputField
                label="Description"
                id={`lines.${index}.description`}
                type="text"
                register={register}
                errors={errors}
                className={inputClassName}
              />

              <InputField
                label="Amount (per unit)"
                id={`lines.${index}.amount`}
                type="number"
                register={register}
                errors={errors}
                className={inputClassName}
                min="0"
                step="0.01"
                valueAsNumber
              />

              <InputField
                label="Quantity"
                id={`lines.${index}.quantity`}
                type="number"
                register={register}
                errors={errors}
                className={inputClassName}
                min="1"
                step="1"
                valueAsNumber
              />

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

        {/* Totals */}
        <section>
          <h3 className="text-md font-semibold mb-2">Totals</h3>
          <p className="font-bold">Grand Total: ${subtotal.toFixed(2)}</p>
        </section>

        <Button variant="outline" type="submit" disabled={isPending}>
          {isPending ? <>Updating Invoice...<Spinner /></> : 'Update Invoice'}
        </Button>
      </form>

      {/* Reusable Alerts */}
      {isSuccess && data && (
        <AlertMessage type="success" message="Invoice updated successfully!" />
      )}

      {isError && error && (
        <AlertMessage type="error" message={`Error updating invoice: ${error.message}`} />
      )}
    </>
  );
}
