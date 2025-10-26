'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type z from 'zod'
import Spinner from '@/components/ui/loaders/spinner'
import { useIsSnowService } from '@/lib/hooks/useStripe'
import { useCreateStripeSubscriptionQuote } from '@/lib/mutations/mutations'
import { schemaCreateSubscription } from '@/lib/zod/schemas'
import type { CreateSubscriptionFormProps } from '@/types/forms-types'
import { Button } from '../../button'
import { FormInput, FormSelect } from '../../forms/form'
import { AlertMessage } from '../shared/alert-message'

export const CreateSubscriptionForm: React.FC<CreateSubscriptionFormProps> = ({
	organizationIdPromise,
	clientsPromise,
}) => {
	const clients = use(clientsPromise)
	const organizationId = use(organizationIdPromise)

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<z.infer<typeof schemaCreateSubscription>>({
		resolver: zodResolver(schemaCreateSubscription),
		mode: 'onBlur',
		defaultValues: {
			clientName: '',
			clientEmail: '',
			phone_number: '',
			address: '',
			serviceType: 'weekly', // Default value
			price_per_month: 0,
			startDate: '',
			endDate: '',
			notes: '',
			organization_id: organizationId || '',
			collectionMethod: 'send_invoice',
		},
	})

	const serviceType = watch('serviceType')
	const clientName = watch('clientName')
	const snow = useIsSnowService(serviceType)

	useEffect(() => {
		const selectedClient = clients.find(
			(client) => client.full_name === clientName,
		)
		if (selectedClient) {
			setValue('clientEmail', selectedClient.email_address)
			setValue('phone_number', selectedClient.phone_number)
			setValue('address', selectedClient.address)
		} else {
			setValue('clientEmail', '')
			setValue('phone_number', '')
			setValue('address', '')
		}
	}, [clientName, clients, setValue])

	const { mutate, isPending, isSuccess, isError, data, error } =
		useCreateStripeSubscriptionQuote(snow)

	const onSubmit = (formData: z.infer<typeof schemaCreateSubscription>) => {
		const form = new FormData()
		for (const key in formData) {
			const value = formData[key as keyof typeof formData]
			if (value !== undefined && value !== null) {
				form.append(key, String(value))
			}
		}
		mutate(form)
	}

	const isClientSelected = clients.some(
		(client) => client.full_name === clientName,
	)

	return (
		<>
			<form className="space-y-4 " onSubmit={handleSubmit(onSubmit)}>
				<FormInput
					control={control}
					hidden
					label="organization_id"
					name="organization_id"
				/>

				{/* Client Info */}
				<section>
					<h3 className="text-md font-semibold mb-2">
						Client Information
					</h3>
					<div>
						<FormInput
							control={control}
							label="Name"
							list="clients-list"
							name="clientName"
						/>
						<datalist id="clients-list">
							{clients.map((client) => (
								<option
									key={client.id}
									value={client.full_name}
								/>
							))}
						</datalist>
					</div>
					<FormInput
						control={control}
						disabled={isClientSelected}
						label="Email"
						name="clientEmail"
					/>
					<FormInput
						control={control}
						disabled={isClientSelected}
						label="Phone Number"
						name="phone_number"
					/>
					<FormInput
						control={control}
						disabled={isClientSelected}
						label="Address"
						name="address"
					/>
				</section>

				{/* Subscription Details */}
				<section>
					<h3 className="text-md font-semibold mb-2">
						Subscription Details
					</h3>
					<div>
						<FormSelect
							control={control}
							label="Service Type"
							name="serviceType"
							options={[
								{ value: 'weekly', label: 'Weekly' },
								{ value: 'bi-weekly', label: 'Bi-Weekly' },
								{ value: 'monthly', label: 'Monthly' },
								{ value: 'snow-as-needed', label: 'Snow as needed' },
							]}
						/>
					</div>
					<FormInput
						control={control}
						label="Price Per Month"
						name="price_per_month"
						step="0.01"
						type="number"
					/>
					<FormInput
						control={control}
						label="Start Date"
						name="startDate"
						type="date"
					/>
					<FormInput
						control={control}
						label="End Date"
						name="endDate"
						type="date"
					/>
					<FormInput
						control={control}
						label="Notes"
						name="notes"
						type="textarea"
					/>
				</section>

				<div>
					<Button
						disabled={isPending}
						type="submit"
						variant="outline"
					>
						{isPending ? (
							<>
								Creating Subscription...
								<Spinner />
							</>
						) : (
							'Create Subscription'
						)}
					</Button>
				</div>
			</form>
			{isSuccess && data && (
				<AlertMessage
					message="Subscription Quote created successfully!"
					type="success"
				/>
			)}
			{isError && error && (
				<AlertMessage
					message={`Error creating subscription: ${error.message}`}
					type="error"
				/>
			)}
		</>
	)
}
