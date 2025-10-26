'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type Stripe from 'stripe'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/forms/form'
import { useCreateStripeQuote } from '@/lib/mutations/mutations'
import { schemaCreateQuote } from '@/lib/zod/schemas'
import type { CreateSubscriptionFormProps } from '@/types/forms-types'
import Spinner from '../../loaders/spinner'
import { AlertMessage } from '../shared/alert-message'
import { QuoteLineItem } from './quote-line-item'

export function CreateQuoteForm({
	organizationIdPromise,
	clientsPromise,
	productsPromise,
}: CreateSubscriptionFormProps) {
	const { mutate, isPending, isSuccess, isError, data, error } =
		useCreateStripeQuote({
			onSuccess: () => {
				console.log('Update successful')
			},
		})
	const organizationId = use(organizationIdPromise)
	const clients = use(clientsPromise)
	let products: Stripe.Product[]
	if (productsPromise) products = use(productsPromise)

	const form = useForm<z.infer<typeof schemaCreateQuote>>({
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
		control: form.control,
		name: 'materials',
	})

	const watchedValues = form.watch()
	const clientName = watchedValues.clientName

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
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
						<FormInput
							control={form.control}
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

				{/* Labour Details */}
				<section>
					<h3 className="text-md font-semibold mb-2">Cost Details</h3>
					<FormInput
						control={form.control}
						label="Labour Cost (per unit)"
						name="labourCostPerUnit"
						step="0.01"
						type="number"
					/>
					<FormInput
						control={form.control}
						label="Labour Units"
						name="labourUnits"
						step="1"
						type="number"
					/>
				</section>

				{/* Dynamic Materials Section */}
				<section>
					<h3 className="text-md font-semibold mb-2">Materials</h3>
					{fields.map((item, index) => (
						<div key={item.id}>
							<QuoteLineItem
								control={form.control}
								index={index}
								products={products}
								setValue={form.setValue}
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
					path="Quotes"
					pathname="/billing/manage/quotes"
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
