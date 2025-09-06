'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SubmitAddClientToList from "../buttons/submit-add-client-to-list";
import FormHeader from "../header/form-header";
import { InputField } from "../inputs/input";
import { AddClientFormSchema, AddClientFormValues } from '@/lib/zod/client-schemas';

export function AddClientForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddClientFormValues>({
        resolver: zodResolver(AddClientFormSchema),
    });

    const onSubmit = (data: AddClientFormValues) => {
        console.log(data);
        // Here you would typically call your server action or API to add the client
        // For example: await addClientAction(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full pb-2">
            <FormHeader text="Add New Client" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                    type="text"
                    placeholder="Full Name"
                    {...register("full_name")}
                    error={errors.full_name?.message}
                />
                <InputField
                    type="tel"
                    placeholder="Phone Number"
                    {...register("phone_number")}
                    error={errors.phone_number?.message}
                />
                <InputField
                    type="email"
                    placeholder="Email Address"
                    {...register("email_address")}
                    error={errors.email_address?.message}
                />
                <InputField
                    type="text"
                    placeholder="Address"
                    {...register("address")}
                    error={errors.address?.message}
                    className="md:col-span-2 lg:col-span-3"
                />
            </div>
            <div className="flex justify-end">
                <SubmitAddClientToList />
            </div>
        </form>
    );
}