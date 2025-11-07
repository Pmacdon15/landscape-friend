'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAddClient } from '@/lib/mutations/mutations'
import {
	AddClientFormSchema,
	type AddClientFormValues,
} from '@/lib/zod/client-schemas'
import { Button } from '../button'
import { FormInput } from '../forms/form'
import FormHeader from '../header/form-header'
import EllipsisSpinner from '../loaders/EllipsisSpinner'

export function AddClientForm() {
	const form = useForm<AddClientFormValues>({
		resolver: zodResolver(AddClientFormSchema),
		defaultValues: {
			full_name: '',
			phone_number: '',
			email_address: '',
			address: '',
		},
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
			className="flex w-full flex-col gap-6 pb-2"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<FormHeader text="Add New Client" />
			<div className="flex flex-col gap-2">
				<FormInput
					control={form.control}
					label={'Full Name'}
					name={'full_name'}
				/>

				<FormInput
					control={form.control}
					label={'Phone Number'}
					name={'phone_number'}
				/>

				<FormInput
					control={form.control}
					label={'Email Address'}
					name={'email_address'}
				/>

				<FormInput
					control={form.control}
					label={'Address'}
					name={'address'}
				/>
			</div>
			<div className="flex justify-end">
				<Button disabled={isPending} type="submit" variant={'outline'}>
					{!isPending ? (
						'Submit'
					) : (
						<div className="flex justify-center gap-4">
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
