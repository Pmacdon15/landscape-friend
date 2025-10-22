'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAddClient } from '@/lib/mutations/mutations'
import {
	AddClientFormSchema,
	type AddClientFormValues,
} from '@/lib/zod/client-schemas'
import { Button } from '../button'
import FormHeader from '../header/form-header'
import { InputField } from '../inputs/input'
import EllipsisSpinner from '../loaders/EllipsisSpinner'

export function AddClientForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AddClientFormValues>({
		resolver: zodResolver(AddClientFormSchema),
	})

	const { mutate, isPending, isError } = useAddClient()

	const onSubmit = (data: AddClientFormValues) => {
		const formData = new FormData()
		for (const key in data) {
			formData.append(
				key,
				data[key as keyof AddClientFormValues] as string,
			)
		}
		mutate(formData)
	}

	return (
		<form
			className="flex flex-col gap-6 w-full pb-2"
			onSubmit={handleSubmit(onSubmit)}
		>
			<FormHeader text="Add New Client" />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<InputField
					placeholder="Full Name"
					type="text"
					{...register('full_name')}
					error={errors.full_name?.message}
				/>
				<InputField
					placeholder="Phone Number"
					type="tel"
					{...register('phone_number')}
					error={errors.phone_number?.message}
				/>
				<InputField
					placeholder="Email Address"
					type="email"
					{...register('email_address')}
					error={errors.email_address?.message}
				/>
				<InputField
					placeholder="Address"
					type="text"
					{...register('address')}
					className="md:col-span-2 lg:col-span-3"
					error={errors.address?.message}
				/>
			</div>
			<div className="flex justify-end">
				<Button disabled={isPending} type="submit" variant={'outline'}>
					{!isPending ? (
						'Submit'
					) : (
						<div className="flex gap-4 justify-center">
							{' '}
							Submitting <EllipsisSpinner />
						</div>
					)}
				</Button>
				{isError && <p className="text-red-500">Error Submitting</p>}
			</div>
		</form>
	)
}
