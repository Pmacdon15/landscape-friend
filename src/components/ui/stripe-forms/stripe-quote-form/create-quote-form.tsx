'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect, useEffectEvent, useMemo, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import type { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FormInput, FormSelect } from '@/components/ui/forms/form'
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
	const organizationId = use(organizationIdPromise)
	const clients = use(clientsPromise)

	const productInfo = use(
		productsPromise ??
			Promise.resolve({ products: [], productsPrices: [] }),
	)

	const products = useMemo(() => {
		if (!('errorMessage' in productInfo)) return productInfo.products
		return []
	}, [productInfo])

	const prices = useMemo(() => {
		if (!('errorMessage' in productInfo)) return productInfo.productsPrices
		return []
	}, [productInfo])

	const [selectedClientId, setSelectedClientId] = useState(0)

	// 🔑 tracks whether a row is still auto-priced
	const [autoPricedRows, setAutoPricedRows] = useState<
		Record<number, boolean>
	>({})

	const form = useForm({
		resolver: zodResolver(schemaCreateQuote),
		mode: 'onBlur',
		defaultValues: {
			clientName: '',
			clientEmail: '',
			phone_number: '',
			addresses: [] as string[],
			description: '',
			labourCostPerUnit: 0,
			labourUnits: 0,
			materials: [
				{ materialType: '', materialCostPerUnit: 0, materialUnits: 0 },
			],
			organization_id: organizationId ?? '',
		},
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'materials',
	})

	const watchedValues = form.watch()
	const watchedMaterials = useWatch({
		control: form.control,
		name: 'materials',
	})

	useEffect(() => {
		const selectedClient = clients.find(
			(c) => c.full_name === watchedValues.clientName,
		)

		if (!selectedClient) {
			form.setValue('clientEmail', '')
			form.setValue('phone_number', '')
			form.setValue('addresses', [])
			setSelectedClientId(0)
			return
		}

		form.setValue('clientEmail', selectedClient.email_address)
		form.setValue('phone_number', selectedClient.phone_number)
		form.setValue('addresses', selectedClient.addresses || [])
		setSelectedClientId(selectedClient.id)
	}, [watchedValues.clientName, clients, form])

	const updateMaterialCost = useEffectEvent(
		(index: number, value: number) => {
			form.setValue(`materials.${index}.materialCostPerUnit`, value)
		},
	)

	useEffect(() => {
		if (!watchedMaterials || prices.length === 0) return

		watchedMaterials.forEach((material, index) => {
			if (!material.materialType) return
			if (autoPricedRows[index] === false) return // 🔒 user edited

			const productPrice = prices.find(
				(p) => p.product === material.materialType,
			)?.unit_amount_decimal

			if (!productPrice) return

			const nextCost = Number(productPrice) / 100
			const currentCost = material.materialCostPerUnit ?? 0

			if (currentCost !== nextCost) {
				updateMaterialCost(index, nextCost)

				setAutoPricedRows((prev) => ({
					...prev,
					[index]: true,
				}))
			}
		})
	}, [watchedMaterials, prices, autoPricedRows])

	// reset locks when rows change
	useEffect(() => {
		setAutoPricedRows({})
		console.log('fields: ', fields.length)
	}, [fields.length])

	const total =
		watchedValues.labourCostPerUnit * watchedValues.labourUnits +
		(watchedMaterials?.reduce((acc, item) => {
			return (
				acc +
				(item.materialCostPerUnit ?? 0) * (item.materialUnits ?? 0)
			)
		}, 0) ?? 0)

	const { mutate, isPending, isSuccess, isError, data, error } =
		useCreateStripeQuote()

	const onSubmit = (formData: z.infer<typeof schemaCreateQuote>) => {
		mutate({ quoteData: formData, clientId: selectedClientId })
	}

	return (
		<>
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<FormInput
					control={form.control}
					hidden
					label="organization_id"
					name="organization_id"
				/>

				<section>
					<h3 className="mb-2 font-semibold">Client Information</h3>
					<FormSelect
						control={form.control}
						label="Name"
						name="clientName"
						options={clients.map((c) => ({
							value: c.full_name,
							label: c.full_name,
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
						label="Phone"
						name="phone_number"
					/>
					<div className="space-y-2">
						<label className="font-semibold text-sm">
							Addresses
						</label>
						{clients
							.find(
								(c) => c.full_name === watchedValues.clientName,
							)
							?.addresses.map((addr) => (
								<div
									className="flex items-center space-x-2"
									key={addr}
								>
									<input
										checked={watchedValues.addresses?.includes(
											addr,
										)}
										className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										onChange={(e) => {
											const current =
												watchedValues.addresses || []
											if (e.target.checked) {
												form.setValue('addresses', [
													...current,
													addr,
												])
											} else {
												form.setValue(
													'addresses',
													current.filter(
														(a) => a !== addr,
													),
												)
											}
										}}
										type="checkbox"
									/>
									<span className="text-sm">{addr}</span>
								</div>
							))}
					</div>
					<div className="mt-4">
						<label className="mb-1 block font-semibold text-sm">
							Description
						</label>
						<textarea
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							{...form.register('description')}
							placeholder="Project description..."
							rows={3}
						/>
					</div>
				</section>
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
				<section>
					<h3 className="mb-2 font-semibold">Materials</h3>

					{fields.map((field, index) => (
						<div className="mb-4 rounded border p-4" key={field.id}>
							<FormSelect
								control={form.control}
								label="Material"
								name={`materials.${index}.materialType`}
								onValueChange={() =>
									setAutoPricedRows((prev) => ({
										...prev,
										[index]: true,
									}))
								}
								options={products.map((p) => ({
									value: p.id,
									label: p.name,
								}))}
							/>

							<FormInput
								control={form.control}
								label="Material Cost (per unit)"
								name={`materials.${index}.materialCostPerUnit`}
								onValueChange={() =>
									setAutoPricedRows((prev) => ({
										...prev,
										[index]: false,
									}))
								}
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
									Remove
								</Button>
							)}
						</div>
					))}

					<Button
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

				<p className="font-bold">Total: ${total.toFixed(2)}</p>

				<Button disabled={isPending} type="submit">
					{isPending ? (
						<>
							Creating Quote <Spinner />
						</>
					) : (
						'Create Quote'
					)}
				</Button>
			</form>

			{isSuccess && data && (
				<AlertMessage
					message="Quote created successfully!"
					path="Quotes"
					pathname={`/billing/manage/quotes?search=${data.quoteId}`}
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
