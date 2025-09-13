'use client';
import { useCreateStripeQuote } from '@/lib/mutations/mutations';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaCreateQuote } from '@/lib/zod/schemas';
import { useCreateQuoteForm } from '@/lib/hooks/hooks';
import { z } from 'zod';
import InputField from '../shared/input';
import { DynamicFields } from '../shared/dynamic-fields';
import Spinner from '../../loaders/spinner';
import { AlertMessage } from '../shared/alert-message';
import { ClientInfoList } from '@/types/clients-types';
import { use, useEffect } from 'react';
import Stripe from 'stripe';
import { CreateSubscriptionFormProps } from '@/types/forms-types';

export function CreateQuoteForm({ organizationIdPromise, clientsPromise, productsPromise }: CreateSubscriptionFormProps) {
    const { mutate, isPending, isSuccess, isError, data, error } = useCreateStripeQuote();
    const organizationId = use(organizationIdPromise)
    const clients = use(clientsPromise)
    const products = use(productsPromise)

    const { register, watch, control, reset, handleSubmit, setValue, formState: { errors } } = useForm<z.infer<typeof schemaCreateQuote>>({
        resolver: zodResolver(schemaCreateQuote),
        mode: 'onBlur',
        defaultValues: {
            clientName: '',
            clientEmail: '',
            phone_number: '',
            address: '',
            labourCostPerUnit: 0,
            labourUnits: 0,
            materials: [{ materialType: '', materialCostPerUnit: 0, materialUnits: 0 }],
            organization_id: organizationId || "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "materials",
    });

    const watchedValues = watch();
    const clientName = watchedValues.clientName;

    useEffect(() => {
        const selectedClient = clients.find(client => client.full_name === clientName);
        if (selectedClient) {
            setValue('clientEmail', selectedClient.email_address);
            setValue('phone_number', selectedClient.phone_number);
            setValue('address', selectedClient.address);
        } else {
            setValue('clientEmail', '');
            setValue('phone_number', '');
            setValue('address', '');
        }
    }, [clientName, clients, setValue]);

    useCreateQuoteForm({ isSuccess, reset, fields, append });

    const onSubmit = (formData: z.infer<typeof schemaCreateQuote>) => {
        mutate(formData);
    };

    const inputClassName = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";

    const total = (watchedValues.labourCostPerUnit * watchedValues.labourUnits) +
        (watchedValues.materials?.reduce((acc, item) => {
            const cost = item.materialCostPerUnit ?? 0;
            const units = item.materialUnits ?? 0;
            return acc + (cost * units);
        }, 0) ?? 0);

    const isClientSelected = clients.some(client => client.full_name === clientName);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" {...register('organization_id')} value={organizationId || ""} />

                {/* Client Info */}
                <section>
                    <h3 className="text-md font-semibold mb-2">Client Information</h3>
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
                        <input id="clientName" {...register('clientName')} list="clients-list" className={inputClassName} />
                        <datalist id="clients-list">
                            {clients.map(client => (
                                <option key={client.id} value={client.full_name} />
                            ))}
                        </datalist>
                    </div>
                    <InputField label="Client Email" id="clientEmail" type="text" register={register} errors={errors} className={inputClassName} disabled={isClientSelected} />
                    <InputField label="Phone Number" id="phone_number" type="text" register={register} errors={errors} className={inputClassName} disabled={isClientSelected} />
                    <InputField label="Address" id="address" type="text" register={register} errors={errors} className={inputClassName} disabled={isClientSelected} />
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
                    labels={{ description: 'Material', amount: 'Material Cost (per unit)', quantity: 'Material Units' }}
                    newItem={() => ({ materialType: '', materialCostPerUnit: 0, materialUnits: 0 })}
                />

                <p className="font-bold mt-2">Total: ${total.toFixed(2)}</p>
                <div>
                    <Button variant="outline" type="submit" disabled={isPending}>
                        {isPending ? <>Creating Quote...<Spinner /></> : 'Create Quote'}
                    </Button>
                </div>

                {/* <BackToLink path={'/billing/manage/quotes'} place={'Quotes'} /> */}
            </form>

            {/* Alerts */}
            {isSuccess && data && <AlertMessage type="success" message="Quote created successfully!" />}
            {isError && error && <AlertMessage type="error" message={`Error creating quote: ${error.message}`} />}
        </>
    );
}
