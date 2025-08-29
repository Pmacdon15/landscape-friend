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
import { AlertMessage } from '../stripe-forms/shared/alert-message';
import { DynamicFields } from '../stripe-forms/shared/dynamic-fields';

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
   
    return (
        <>
            <form action={mutate} className="space-y-4">
                <input type="hidden" {...register('organization_id')} value={organizationId} />

                {/* Client Info */}
                <section>
                    <h3 className="text-md font-semibold mb-2">Client Information</h3>
                    <InputField label="Client Name" id="clientName" type="text" register={register} errors={errors} className={inputClassName} />
                    <InputField label="Client Email" id="clientEmail" type="email" register={register} errors={errors} className={inputClassName} />
                    <InputField label="Phone Number" id="phone_number" type="text" register={register} errors={errors} className={inputClassName} />
                    <InputField label="Address" id="address" type="text" register={register} errors={errors} className={inputClassName} />
                </section>

                {/* Labour Details */}
                <section>
                    <h3 className="text-md font-semibold mb-2">Cost Details</h3>
                    <InputField label="Labour Cost (per unit)" id="labourCostPerUnit" type="number" register={register} errors={errors} className={inputClassName} min="0" step="0.01" valueAsNumber />
                    <InputField label="Labour Units" id="labourUnits" type="number" register={register} errors={errors} className={inputClassName} min="1" step="1" valueAsNumber />
                </section>

                {/* Dynamic Materials Section */}
                <DynamicFields
                    name="materials"
                    fields={fields}
                    append={append}
                    remove={remove}
                    register={register}
                    control={control}
                    errors={errors}
                    watch={watch}
                    labels={{ description: 'Material', amount: 'Material Cost (per unit)', quantity: 'Material Units' }}
                    newItem={() => ({ materialType: '', materialCostPerUnit: 0, materialUnits: 0 })}
                />


                <Button variant="outline" type="submit" disabled={isPending}>
                    {isPending ? <>Creating Quote...<Spinner /></> : 'Create Quote'}
                </Button>
            </form>

            {/* Alerts */}
            {isSuccess && data && <AlertMessage type="success" message="Quote created successfully!" />}
            {isError && error && <AlertMessage type="error" message={`Error creating quote: ${error.message}`} />}
        </>
    );
}
