'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type z from 'zod'
import Spinner from '@/components/ui/loaders/spinner'
import { useIsSnowService } from '@/lib/hooks/useStripe'
import { useCreateStripeSubscriptionQuote } from '@/lib/mutations/mutations'
import { inputClassName } from '@/lib/values'
import { schemaCreateSubscription } from '@/lib/zod/schemas'
import type { CreateSubscriptionFormProps } from '@/types/forms-types'
import { Button } from '../../button'
import { AlertMessage } from '../shared/alert-message'
import InputField from '../shared/input'

export const CreateSubscriptionForm: React.FC<CreateSubscriptionFormProps> = ({
	organizationIdPromise,
	clientsPromise,
}) => {
	const clients = use(clientsPromise)
	const organizationId = use(organizationIdPromise)

	const {
		register,
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
			organization_id: organizationId,
			collectionMethod: 'send_invoice',
		} as z.infer<typeof schemaCreateSubscription>, // Explicitly cast defaultValues
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
				<input
					type="hidden"
					{...register('organization_id')}
					value={organizationId || ''}
				/>

				{/* Client Info */}
				<section>
					<h3 className="text-md font-semibold mb-2">
						Client Information
					</h3>
					<div>
						<label
							className="block text-sm font-medium text-gray-700"
							htmlFor="clientName"
						>
							Name
						</label>
						<input
							id="clientName"
							{...register('clientName')}
							className={inputClassName}
							list="clients-list"
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
					<InputField
						className={inputClassName}
						disabled={isClientSelected}
						errors={errors}
						id="clientEmail"
						label="Email"
						register={register}
						type="text"
					/>
					<InputField
						className={inputClassName}
						disabled={isClientSelected}
						errors={errors}
						id="phone_number"
						label="Phone Number"
						register={register}
						type="text"
					/>
					<InputField
						className={inputClassName}
						disabled={isClientSelected}
						errors={errors}
						id="address"
						label="Address"
						register={register}
						type="text"
					/>
				</section>

				{/* Subscription Details */}
				<section>
					<h3 className="text-md font-semibold mb-2">
						Subscription Details
					</h3>
					<div>
						<label
							className="block text-sm font-medium text-gray-700"
							htmlFor="serviceType"
						>
							Service Type
						</label>
						<select
							id="serviceType"
							{...register('serviceType')}
							className={inputClassName}
						>
							<option value="weekly">Weekly</option>
							<option value="bi-weekly">Bi-Weekly</option>
							<option value="monthly">Monthly</option>
							<option value="as-needed">Snow as needed</option>
						</select>
						{errors.serviceType && (
							<p className="text-red-500 text-xs mt-1">
								{errors.serviceType.message}
							</p>
						)}
					</div>
					<InputField
						className={inputClassName}
						errors={errors}
						id="price_per_month"
						label="Price Per Month"
						min="0.01"
						register={register}
						step="0.01"
						type="number"
						valueAsNumber
					/>
					<InputField
						className={inputClassName}
						errors={errors}
						id="startDate"
						label="Start Date"
						register={register}
						type="date"
					/>
					<InputField
						className={inputClassName}
						errors={errors}
						id="endDate"
						label="End Date"
						register={register}
						type="date"
					/>
					<InputField
						className={inputClassName}
						errors={errors}
						id="notes"
						label="Notes"
						register={register}
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
