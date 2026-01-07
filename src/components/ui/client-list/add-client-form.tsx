'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type z from 'zod'
import { useAddClient } from '@/lib/mutations/mutations'
import { AddClientFormSchema } from '@/lib/zod/client-schemas'
import { Button } from '../button'
import { FormInput } from '../forms/form'
import FormHeader from '../header/form-header'
import EllipsisSpinner from '../loaders/EllipsisSpinner'

export function AddClientForm({
	setSheetOpen,
}: {
	setSheetOpen: (open: boolean) => void
}) {
	const form = useForm({
		resolver: zodResolver(AddClientFormSchema),
		defaultValues: {
			full_name: '',
			phone_number: undefined,
			email_address: '',
			addresses: [{ address: '' }],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'addresses',
	})

	const { mutate, isPending, isError, error } = useAddClient({
		onSuccess: () => {
			form.reset()
			setSheetOpen(false)
			toast.success('Client added!', { duration: 1500 })
		},
		onError: (error) => {
			console.error('Error adding client', error)
			toast.error('Error adding client!', { duration: 1500 })
		},
	})

	const onSubmit = (data: z.infer<typeof AddClientFormSchema>) => {
		mutate(data)
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
					type="tel"
				/>

				<FormInput
					control={form.control}
					label={'Email Address'}
					name={'email_address'}
				/>
				<div>
					{fields.map((field, index) => (
						<div className="flex items-end gap-2" key={field.id}>
							<FormInput
								control={form.control}
								label={`Address ${index + 1}`}
								name={`addresses.${index}.address`}
							/>
							<Button
								onClick={() => remove(index)}
								type="button"
								variant="destructive"
							>
								Remove
							</Button>
						</div>
					))}
					<Button
						className="mt-2"
						onClick={() => append({ address: '' })}
						type="button"
						variant="outline"
					>
						Add Address
					</Button>
				</div>
			</div>
			<div className="flex justify-end gap-2">
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
				{isError && (
					<p className="text-red-500">
						{error.message ?? 'Error adding client'}
					</p>
				)}
			</div>
		</form>
	)
}
