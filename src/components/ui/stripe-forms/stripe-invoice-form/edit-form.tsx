'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { type SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useResetFormOnSuccess } from '@/lib/hooks/hooks'
import { useUpdateStripeDocument } from '@/lib/mutations/mutations'
import { schemaUpdateStatement } from '@/lib/zod/schemas'
import type { EditStripeForm } from '@/types/stripe-types'
import BackToLink from '../../links/back-to-link'
import Spinner from '../../loaders/spinner'
import { AlertMessage } from '../shared/alert-message'
import { DynamicFields } from '../shared/dynamic-fields' // our reusable component

export function EditForm({
	invoiceOrQuote,
	invoice = false,
}: {
	invoiceOrQuote: EditStripeForm
	invoice?: boolean
}) {
	const { mutate, isPending, isSuccess, isError, data, error } =
		useUpdateStripeDocument()

	const {
		register,
		watch,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<z.input<typeof schemaUpdateStatement>>({
		resolver: zodResolver(schemaUpdateStatement),
		defaultValues: {
			id: invoiceOrQuote.id || '',
			lines: (invoiceOrQuote.lines?.data || []).map((line) => ({
				description: line.description || '',
				amount: line.amount,
				quantity: line.quantity,
			})),
		} as z.input<typeof schemaUpdateStatement>,
	})

	const submittedData = React.useRef<z.input<
		typeof schemaUpdateStatement
	> | null>(null)

	useResetFormOnSuccess(isSuccess, submittedData, reset)

	const { fields, append, remove } = useFieldArray({ control, name: 'lines' })

	const watchedLines = watch('lines')
	const subtotal =
		watchedLines?.reduce(
			(acc, item) => acc + Number(item.amount) * Number(item.quantity),
			0,
		) ?? 0

	const onSubmit: SubmitHandler<z.input<typeof schemaUpdateStatement>> = (
		formData,
	) => {
		submittedData.current = formData
		mutate(formData as z.infer<typeof schemaUpdateStatement>)
	}

	return (
		<>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<input
					type="hidden"
					{...register('id')}
					value={invoiceOrQuote.id}
				/>

				{/* Reusable Dynamic Fields for Invoice Lines */}
				<section>
					<h3 className="text-md font-semibold mb-2">
						Invoice Lines
					</h3>
					<DynamicFields
						append={append}
						control={control}
						errors={errors}
						fields={fields}
						labels={{
							description: 'Invoice Line',
							amount: 'Amount (per unit)',
							quantity: 'Quantity',
						}}
						name="lines"
						newItem={() => ({
							description: '',
							amount: 0,
							quantity: 1,
						})}
						register={register}
						remove={remove}
					/>
				</section>

				<p className="font-bold mt-2">
					Subtotal: ${subtotal.toFixed(2)}
				</p>

				<div>
					<Button
						disabled={isPending}
						type="submit"
						variant="outline"
					>
						{isPending ? (
							<>
								Updating document...
								<Spinner />
							</>
						) : (
							'Update Document'
						)}
					</Button>
				</div>

				<BackToLink
					path={'/billing/manage/invoices'}
					place={'Invoices'}
				/>
			</form>

			{/* Reusable Alerts */}
			{isSuccess && data && (
				<AlertMessage
					id={invoiceOrQuote.id}
					message={`${invoice ? 'Invoice' : 'Quote'} updated successfully!`}
					pathname={
						invoice
							? '/billing/manage/invoices'
							: '/billing/manage/quotes'
					}
					type="success"
				/>
			)}
			{isError && error && (
				<AlertMessage
					message={`Error updating quote: ${error.message}`}
					type="error"
				/>
			)}
		</>
	)
}
