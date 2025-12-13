'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type z from 'zod'
import { useUpdateClient } from '@/lib/mutations/mutations'
import { AddClientFormSchema } from '@/lib/zod/client-schemas'
import type { Client } from '@/types/clients-types'
import { Button } from '../button'
import { FormInput } from '../forms/form'
import FormHeader from '../header/form-header'
import EllipsisSpinner from '../loaders/EllipsisSpinner'

export function EditClientForm({
	client,
	setSheetOpen,
	page
}: {
	client: Client
	setSheetOpen: (open: boolean) => void
	page:number
}) {
	const form = useForm({
		resolver: zodResolver(AddClientFormSchema),
		defaultValues: {
			full_name: client.full_name,
			phone_number: client.phone_number,
			email_address: client.email_address || '',
			address: client.address,
		},
	})

	const { mutate, isPending, isError, error } = useUpdateClient(page,{
		onSuccess: () => {
			form.reset()
			setSheetOpen(false)
			toast.success('Client updated!', { duration: 1500 })
		},
		onError: (error) => {
			console.error('Error updating client', error)
			toast.error('Error updating client!', { duration: 1500 })
		},
	})

	const onSubmit = (data: z.infer<typeof AddClientFormSchema>) => {
		mutate({ data, clientId: client.id })
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

				<FormInput
					control={form.control}
					label={'Address'}
					name={'address'}
				/>
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
						{error.message ?? 'Error updating client'}
					</p>
				)}
			</div>
		</form>
	)
}
