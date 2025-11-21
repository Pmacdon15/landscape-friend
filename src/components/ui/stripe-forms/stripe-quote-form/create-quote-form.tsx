'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FormInput, FormSelect } from '@/components/ui/forms/form'
import { useProductPrices } from '@/lib/hooks/useStripe'
import { useCreateStripeQuote } from '@/lib/mutations/mutations'
import { schemaCreateQuote } from '@/lib/zod/schemas'
import type { CreateSubscriptionFormProps } from '@/types/forms-types'
import Spinner from '../../loaders/spinner'
import { AlertMessage } from '../shared/alert-message'

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
	// let products: Stripe.Product[]
	const products = use(productsPromise || Promise.resolve([]))

	const form = useForm({
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

	// const materialTypes = watchedValues.materials.map((_material, index) =>
	// 	form.watch(`materials.${index}.materialType`),
	// )
	// const selectedProducts = products?.filter(
	// 	(product, index) => product.name === materialTypes[index],
	// )
	const materialIds = useMemo(() => {
		return watchedValues.materials.map((material) => material.materialType)
	}, [watchedValues.materials])

	const { data: prices,  } = useProductPrices(materialIds)

	useEffect(() => {
		if (prices) {
			Object.keys(prices).forEach((productId, index) => {
				if (prices[productId]?.unit_amount) {
					form.setValue(
						`materials.${index}.materialCostPerUnit`,
						prices[productId].unit_amount / 100,
					)
				}
			})
		}
	}, [prices, form.setValue])

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
					<FormInput
						control={form.control}
						disabled
						label="Address"
						name="address"
					/>
				</section>

				{/* Labour Details */}
				<section>
					<h3 className="mb-2 font-semibold text-md">Cost Details</h3>
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
					<h3 className="mb-2 font-semibold text-md">Materials</h3>
					{fields.map((item, index) => (
						<div
							className="mb-4 rounded-md border p-4"
							key={item.id}
						>
							<div>
								<FormSelect
									control={form.control}
									label="Material"
									name={`materials.${index}.materialType`}
									options={products?.map((product) => ({
										value: product.name + product.id,
										label: product.name,
									}))}
								/>
							</div>

							<FormInput
								control={form.control}
								// disabled={prices?.[index]?.isLoading}
								label="Material Cost (per unit)"
								name={`materials.${index}.materialCostPerUnit`}
								step="0.01"
								type="number"
							/>

							<FormInput
								control={form.control}
								label="Material Units"
								name={`materials.${index}.materialUnits`}
								type="number"
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

				<p className="mt-2 font-bold">Total: ${total.toFixed(2)}</p>
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
