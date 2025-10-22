'use client'
import { useCreateStripeSubscriptionQuote } from '@/lib/mutations/mutations'
import Spinner from '@/components/ui/loaders/spinner'
import { schemaCreateSubscription } from '@/lib/zod/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import InputField from '../shared/input'
import { AlertMessage } from '../shared/alert-message'
import { Button } from '../../button'
import { useIsSnowService } from '@/lib/hooks/useStripe'
import { use, useEffect } from 'react'
import { CreateSubscriptionFormProps } from '@/types/forms-types'
import { inputClassName } from '@/lib/values'

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
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
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
							htmlFor="clientName"
							className="block text-sm font-medium text-gray-700"
						>
							Name
						</label>
						<input
							id="clientName"
							{...register('clientName')}
							list="clients-list"
							className={inputClassName}
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
						label="Email"
						id="clientEmail"
						type="text"
						register={register}
						errors={errors}
						className={inputClassName}
						disabled={isClientSelected}
					/>
					<InputField
						label="Phone Number"
						id="phone_number"
						type="text"
						register={register}
						errors={errors}
						className={inputClassName}
						disabled={isClientSelected}
					/>
					<InputField
						label="Address"
						id="address"
						type="text"
						register={register}
						errors={errors}
						className={inputClassName}
						disabled={isClientSelected}
					/>
				</section>

				{/* Subscription Details */}
				<section>
					<h3 className="text-md font-semibold mb-2">
						Subscription Details
					</h3>
					<div>
						<label
							htmlFor="serviceType"
							className="block text-sm font-medium text-gray-700"
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
						label="Price Per Month"
						id="price_per_month"
						type="number"
						register={register}
						errors={errors}
						className={inputClassName}
						min="0.01"
						step="0.01"
						valueAsNumber
					/>
					<InputField
						label="Start Date"
						id="startDate"
						type="date"
						register={register}
						errors={errors}
						className={inputClassName}
					/>
					<InputField
						label="End Date"
						id="endDate"
						type="date"
						register={register}
						errors={errors}
						className={inputClassName}
					/>
					<InputField
						label="Notes"
						id="notes"
						type="textarea"
						register={register}
						errors={errors}
						className={inputClassName}
					/>
				</section>

				<div>
					<Button
						variant="outline"
						type="submit"
						disabled={isPending}
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
					type="success"
					message="Subscription Quote created successfully!"
				/>
			)}
			{isError && error && (
				<AlertMessage
					type="error"
					message={`Error creating subscription: ${error.message}`}
				/>
			)}
		</>
	)
}
