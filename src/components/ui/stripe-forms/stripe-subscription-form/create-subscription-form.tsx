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
			addresses: [] as string[],
			addressPricing: [] as { address: string; price: number }[],
			description: '',
			serviceType: 'weekly', // Default value
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
			form.setValue('addresses', selectedClient.addresses || [])
			form.setValue('addressPricing', [])
		} else {
			form.setValue('clientEmail', '')
			form.setValue('phone_number', '')
			form.setValue('addresses', [])
			form.setValue('addressPricing', [])
		}
	}, [clientName, clients, form])

	const { mutate, isPending, isSuccess, isError, data, error } =
		useCreateStripeSubscriptionQuote(snow)

	const onSubmit = (formData: z.infer<typeof schemaCreateSubscription>) => {
		const form = new FormData()
		for (const key in formData) {
			const value = formData[key as keyof typeof formData]
			if (value !== undefined && value !== null) {
				if (
					(key === 'addresses' || key === 'addressPricing') &&
					Array.isArray(value)
				) {
					form.append(key, JSON.stringify(value))
				} else if (value instanceof Date) {
					form.append(key, value.toISOString())
				} else {
					form.append(key, String(value))
				}
			}
		}
		mutate(form)
	}

	// const _isClientSelected = clients.some(
	// 	(client) => client.full_name === clientName,
	// )

	return (
		<>
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<FormInput
					control={form.control}
					hidden
					label="organization_id"
					name="organization_id"
				/>

				{/* Client Info */}
				<section>
					<h3 className="mb-2 font-semibold text-md">
						Client Information
					</h3>
					<FormSelect
						control={form.control}
						label="Name"
						name="clientName"
						options={clients.map((client) => ({
							value: client.full_name,
							label: client.full_name,
						}))}
					/>
					<FormInput
						control={form.control}
						disabled
						label="Email"
						name="clientEmail"
					/>
					<FormInput
						control={form.control}
						disabled
						label="Phone Number"
						name="phone_number"
					/>
					<div className="space-y-2">
						<h1 className="font-semibold text-sm">
							Addresses & Pricing
						</h1>
						{clients
							.find((c) => c.full_name === clientName)
							?.addresses.map((addr) => {
								const addressPricing =
									form.watch('addressPricing') || []
								const currentPricing = addressPricing.find(
									(ap) => ap.address === addr,
								)
								const isSelected = !!currentPricing

								return (
									<div
										className="flex items-center gap-4 rounded border p-2"
										key={addr}
									>
										<input
											checked={isSelected}
											className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											onChange={(e) => {
												const current =
													form.getValues(
														'addressPricing',
													) || []
												if (e.target.checked) {
													form.setValue(
														'addressPricing',
														[
															...current,
															{
																address: addr,
																price: 0,
															},
														],
													)
													// Also add to addresses array
													const addresses =
														form.getValues(
															'addresses',
														) || []
													if (
														!addresses.includes(
															addr,
														)
													) {
														form.setValue(
															'addresses',
															[
																...addresses,
																addr,
															],
														)
													}
												} else {
													form.setValue(
														'addressPricing',
														current.filter(
															(ap) =>
																ap.address !==
																addr,
														),
													)
													// Also remove from addresses array
													const addresses =
														form.getValues(
															'addresses',
														) || []
													form.setValue(
														'addresses',
														addresses.filter(
															(a) => a !== addr,
														),
													)
												}
											}}
											type="checkbox"
										/>
										<span className="flex-1 text-sm">
											{addr}
										</span>
										{isSelected && (
											<div className="flex items-center gap-2">
												<span className="text-sm">
													$
												</span>
												<input
													className="w-32 rounded border px-2 py-1 text-sm"
													min="0.01"
													onChange={(e) => {
														const current =
															form.getValues(
																'addressPricing',
															) || []
														form.setValue(
															'addressPricing',
															current.map((ap) =>
																ap.address ===
																addr
																	? {
																			...ap,
																			price:
																				parseFloat(
																					e
																						.target
																						.value,
																				) ||
																				0,
																		}
																	: ap,
															),
														)
													}}
													placeholder="Price/month"
													step="0.01"
													type="number"
													value={
														currentPricing?.price ||
														''
													}
												/>
												<span className="text-sm">
													/month
												</span>
											</div>
										)}
									</div>
								)
							})}

						{/* Total Price Display */}
						{form.watch('addressPricing')?.length > 0 && (
							<div className="mt-2 rounded bg-gray-50 p-2">
								<span className="font-semibold">
									Total Monthly:{' '}
								</span>
								<span className="text-lg">
									$
									{(form.watch('addressPricing') || [])
										.reduce(
											(sum, ap) => sum + (ap.price || 0),
											0,
										)
										.toFixed(2)}
								</span>
							</div>
						)}
					</div>
					<div className="mt-4">
						<h1 className="mb-1 block font-semibold text-sm">
							Description
						</h1>
						<textarea
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							{...form.register('description')}
							placeholder="Subscription details..."
							rows={3}
						/>
					</div>
				</section>

				{/* Subscription Details */}
				<section className="flex flex-col gap-2">
					<h3 className="mb-2 font-semibold text-md">
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
									value: 'snow-unlimited',
									label: 'Snow unlimited',
								},
							]}
						/>
					</div>
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
