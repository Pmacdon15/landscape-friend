'use client';
import React from 'react';
import { useCreateStripeQuote } from '@/lib/mutations/mutations';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaCreateQuote } from '@/lib/zod/schemas';
import { useCreateQuoteForm } from '@/lib/hooks/hooks';
import Spinner from '../spinner';
import InputField from '../stripe-forms/shared/input';



export function CreateQuoteForm({ organizationId }: { organizationId: string }) {
  const { mutate, isPending, isSuccess, isError, data, error } = useCreateStripeQuote();

  const { register, watch, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schemaCreateQuote),
    defaultValues: {
      labourCostPerUnit: 0,
      labourUnits: 0,
      materials: [{ materialType: '', materialCostPerUnit: 0, materialUnits: 0 }],
      organization_id: organizationId,
    },
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
          <InputField
            label="Client Name"
            id="clientName"
            type="text"
            register={register}
            errors={errors}
            className={inputClassName}
          />
          <InputField
            label="Client Email"
            id="clientEmail"
            type="email"
            register={register}
            errors={errors}
            className={inputClassName}
          />
          <InputField
            label="Phone Number"
            id="phone_number"
            type="text"
            register={register}
            errors={errors}
            className={inputClassName}
          />
          <InputField
            label="Address"
            id="address"
            type="text"
            register={register}
            errors={errors}
            className={inputClassName}
          />
        </section>

        <section>
          <h3 className="text-md font-semibold mb-2">Cost Details</h3>
          <InputField
            label="Labour Cost (per unit)"
            id="labourCostPerUnit"
            type="number"
            register={register}
            errors={errors}
            className={inputClassName}
            min="0"
            step="0.01"
            valueAsNumber
          />
          <InputField
            label="Labour Units"
            id="labourUnits"
            type="number"
            register={register}
            errors={errors}
            className={inputClassName}
            min="1"
            step="1"
            valueAsNumber
          />

          <h4 className="text-md font-semibold mt-4 mb-2">Materials</h4>
          {fields.map((item, index) => (
            <div key={item.id} className="border p-4 mb-4 rounded-md">
              <InputField
                label="Material Type"
                id={`materials.${index}.materialType`}
                type="text"
                register={register}
                errors={errors}
                className={inputClassName}
              />
              <InputField
                label="Material Cost (per unit)"
                id={`materials.${index}.materialCostPerUnit`}
                type="number"
                register={register}
                errors={errors}
                className={inputClassName}
                min="0"
                step="0.01"
                valueAsNumber
              />
              <InputField
                label="Material Units"
                id={`materials.${index}.materialUnits`}
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

        <Button variant="outline" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              Creating Quote...<Spinner />
            </>
          ) : (
            'Create Quote'
          )}
        </Button>
      </form>

      {isSuccess && data && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          <p>Quote created successfully!</p>
          <p>Quote ID: {data.quoteId}</p>
        </div>
      )}

      {isError && error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          <p>Error creating quote:</p>
          <p>{error.message}</p>
        </div>
      )}
    </>
  );
}