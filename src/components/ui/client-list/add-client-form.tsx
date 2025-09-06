'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddClient } from "@/lib/mutations/mutations";
import { Button } from "../button";
import EllipsisSpinner from "../loaders/EllipsisSpinner";
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

    const { mutate, isPending, isError } = useAddClient();

    const onSubmit = (data: AddClientFormValues) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key as keyof AddClientFormValues] as string);
        }
        mutate(formData);
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
                <Button
                    variant={"outline"}
                    type="submit"
                    disabled={isPending}
                >{!isPending ? "Submit" : <div className="flex gap-4 justify-center"> Submitting <EllipsisSpinner /></div>}</Button>
                {isError && <p className="text-red-500">Error Submitting</p>}
            </div>
        </form>
    );
}