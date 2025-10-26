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
import { FormDatePicker, FormInput, FormSelect } from '../../forms/form'
import { AlertMessage } from '../shared/alert-message'

export const CreateSubscriptionForm: React.FC<CreateSubscriptionFormProps> = ({
	organizationIdPromise,
	clientsPromise,
}) => {
	const clients = use(clientsPromise)
	const organizationId = use(organizationIdPromise)

	const currentDate = new Date() // Current date: e.g., 2025-10-26T15:18:00-06:00 (MDT)
	const startDate = new Date(currentDate)
	startDate.setDate(currentDate.getDate() + 2) // Current date + 2 days: e.g., 2025-10-28

	const endDate = new Date(currentDate)
	endDate.setMonth(currentDate.getMonth() + 4) // Add 4 months: e.g., 2026-02-26
	endDate.setDate(currentDate.getDate() + 2) // Add 2 days: e.g., 2026-02-28
	const form = useForm({
		resolver: zodResolver(schemaCreateSubscription),
		mode: 'onBlur',
		defaultValues: {
			clientName: '',
			clientEmail: '',
			phone_number: '',
			address: '',
			serviceType: 'weekly', // Default value
			price_per_month: 0,
			startDate: startDate,
			endDate: endDate,
			organization_id: organizationId || '',
			collectionMethod: 'send_invoice',
		},
	})

	const serviceType = form.watch('serviceType')
	const clientName = form.watch('clientName')
	const snow = useIsSnowService(serviceType)

	useEffect(() => {
		const selectedClient = clients.find(
			(client) => client.full_name === clientName,
		)
		if (selectedClient) {
			form.setValue('clientEmail', selectedClient.email_address)
			form.setValue('phone_number', selectedClient.phone_number)
			form.setValue('address', selectedClient.address)
		} else {
			form.setValue('clientEmail', '')
			form.setValue('phone_number', '')
			form.setValue('address', '')
		}
	}, [clientName, clients, form.setValue, form])

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
			<form className="space-y-4 " onSubmit={form.handleSubmit(onSubmit)}>
				<FormInput
					control={form.control}
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
						<FormSelect
							control={form.control}
							label="Name"
							name="clientName"
							options={clients.map((client) => ({
								value: client.full_name,
								label: client.full_name,
							}))}
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
						control={form.control}
						disabled={isClientSelected}
						label="Email"
						name="clientEmail"
					/>
					<FormInput
						control={form.control}
						disabled={isClientSelected}
						label="Phone Number"
						name="phone_number"
					/>
					<FormInput
						control={form.control}
						disabled={isClientSelected}
						label="Address"
						name="address"
					/>
				</section>

				{/* Subscription Details */}
				<section className="flex flex-col gap-2">
					<h3 className="text-md font-semibold mb-2">
						Subscription Details
					</h3>
					<div>
						<FormSelect
							control={form.control}
							label="Service Type"
							name="serviceType"
							options={[
								{ value: 'weekly', label: 'Weekly' },
								{ value: 'bi-weekly', label: 'Bi-Weekly' },
								{ value: 'monthly', label: 'Monthly' },
								{
									value: 'snow-as-needed',
									label: 'Snow as needed',
								},
							]}
						/>
					</div>
					<FormInput
						control={form.control}
						label="Price Per Month"
						name="price_per_month"
						step="0.01"
						type="number"
					/>
					<FormDatePicker
						control={form.control}
						label="Start Date"
						name="startDate"
					/>
					<FormDatePicker
						control={form.control}
						label={'End Date'}
						name={'endDate'}
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
					path="Quotes"
					pathname="/billing/manage/quotes "
					type="success"
				/>
			)}
			{isError && error && (
				<AlertMessage
					message={`Error creating subscription: ${error.message}`}
					path="Quotes"
					pathname="/billing/manage/quotes "
					type="error"
				/>
			)}
		</>
	)
}
