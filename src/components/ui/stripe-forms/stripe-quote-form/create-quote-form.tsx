'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type Stripe from 'stripe'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useCreateQuoteForm } from '@/lib/hooks/hooks'
import { useCreateStripeQuote } from '@/lib/mutations/mutations'
import { inputClassName } from '@/lib/values'
import { schemaCreateQuote } from '@/lib/zod/schemas'
import type { CreateSubscriptionFormProps } from '@/types/forms-types'
import Spinner from '../../loaders/spinner'
import { AlertMessage } from '../shared/alert-message'
import InputField from '../shared/input'
import { QuoteLineItem } from './quote-line-item'

export function CreateQuoteForm({
	organizationIdPromise,
	clientsPromise,
	productsPromise,
}: CreateSubscriptionFormProps) {
	const { mutate, isPending, isSuccess, isError, data, error } =
		useCreateStripeQuote()
	const organizationId = use(organizationIdPromise)
	const clients = use(clientsPromise)
	let products: Stripe.Product[]
	if (productsPromise) products = use(productsPromise)
	// console.log("Products: ", products)
	const {
		register,
		watch,
		control,
		reset,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<z.infer<typeof schemaCreateQuote>>({
		resolver: zodResolver(schemaCreateQuote),
		mode: 'onBlur',
		defaultValues: {
			clientName: '',
			clientEmail: '',
			phone_number: '',
			address: '',
			labourCostPerUnit: 0,
			labourUnits: 0,
			materials: [
				{ materialType: '', materialCostPerUnit: 0, materialUnits: 0 },
			],
			organization_id: organizationId || '',
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'materials',
	})

	const watchedValues = watch()
	const clientName = watchedValues.clientName

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

	useCreateQuoteForm({ isSuccess, reset, fields, append })

	const onSubmit = (formData: z.infer<typeof schemaCreateQuote>) => {
		mutate(formData)
	}

	const total =
		watchedValues.labourCostPerUnit * watchedValues.labourUnits +
		(watchedValues.materials?.reduce((acc, item) => {
			const cost = item.materialCostPerUnit ?? 0
			const units = item.materialUnits ?? 0
			return acc + cost * units
		}, 0) ?? 0)

	const isClientSelected = clients.some(
		(client) => client.full_name === clientName,
	)

	return (
		<>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

				{/* Labour Details */}
				<section>
					<h3 className="text-md font-semibold mb-2">Cost Details</h3>
					<InputField
						className={inputClassName}
						errors={errors}
						id="labourCostPerUnit"
						label="Labour Cost (per unit)"
						min="0"
						register={register}
						step="0.01"
						type="number"
						valueAsNumber
					/>
					<InputField
						className={inputClassName}
						errors={errors}
						id="labourUnits"
						label="Labour Units"
						min="1"
						register={register}
						step="1"
						type="number"
						valueAsNumber
					/>
				</section>

				{/* Dynamic Materials Section */}
				<section>
					<h3 className="text-md font-semibold mb-2">Materials</h3>
					{fields.map((item, index) => (
						<div key={item.id}>
							<QuoteLineItem
								control={control}
								errors={errors}
								index={index}
								products={products}
								register={register}
								setValue={setValue}
							/>
							{fields.length > 1 && (
								<Button
									className="mt-2"
									onClick={() => remove(index)}
									type="button"
								>
									Remove Material
								</Button>
							)}
						</div>
					))}
					<Button
						className="mt-2"
						onClick={() =>
							append({
								materialType: '',
								materialCostPerUnit: 0,
								materialUnits: 0,
							})
						}
						type="button"
					>
						Add Material
					</Button>
				</section>

				<p className="font-bold mt-2">Total: ${total.toFixed(2)}</p>
				<div>
					<Button
						disabled={isPending}
						type="submit"
						variant="outline"
					>
						{isPending ? (
							<>
								Creating Quote...
								<Spinner />
							</>
						) : (
							'Create Quote'
						)}
					</Button>
				</div>

				{/* <BackToLink path={'/billing/manage/quotes'} place={'Quotes'} /> */}
			</form>

			{/* Alerts */}
			{isSuccess && data && (
				<AlertMessage
					message="Quote created successfully!"
					type="success"
				/>
			)}
			{isError && error && (
				<AlertMessage
					message={`Error creating quote: ${error.message}`}
					type="error"
				/>
			)}
		</>
	)
}
