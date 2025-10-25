'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { useUpdateStripeDocument } from '@/lib/mutations/mutations'
import { schemaUpdateStatement } from '@/lib/zod/schemas'
import type { EditStripeForm } from '@/types/stripe-types'
import { FormInput } from '../../forms/form'
import BackToLink from '../../links/back-to-link'
import Spinner from '../../loaders/spinner'
import { AlertMessage } from '../shared/alert-message'
import { DynamicFields } from '../shared/dynamic-fields'

export function EditForm({
	invoiceOrQuote,
	invoice = false,
}: {
	invoiceOrQuote: EditStripeForm
	invoice?: boolean
}) {
	const form = useForm({
		resolver: zodResolver(schemaUpdateStatement),
		defaultValues: {
			id: invoiceOrQuote.id || '',
			lines: (invoiceOrQuote.lines?.data || []).map((line) => ({
				description: line.description || '',
				amount: line.amount,
				quantity: line.quantity,
			})),
		},
	})

	const {
		fields: lines,
		append,
		remove,
	} = useFieldArray({
		control: form.control,
		name: 'lines',
	})

	const { mutate, isPending, isSuccess, isError, data, error } =
		useUpdateStripeDocument({
			onSuccess: () => {
				console.log('Update successful')
			},
			onError: () => {
				console.error('Update failed Error')
			},
		})

	async function onSubmit(data: z.infer<typeof schemaUpdateStatement>) {
		// submittedData.current = data
		mutate(data as z.infer<typeof schemaUpdateStatement>)
	}

	return (
		<div className="container px-4 mx-auto my-6">
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<FormInput
						control={form.control}						
						label="Id"
						name="id"
					/>
					<section>
						<h3 className="text-md font-semibold mb-2">
							Invoice Lines
						</h3>
						<DynamicFields
							append={append}
							fields={lines}
							form={form}
							labels={{
								description: 'Invoice Line',
								amount: 'Amount (per unit)',
								quantity: 'Quantity',
							}}
							name="lines"
							remove={remove}
						/>
					</section>

					<p className="font-bold mt-2">
						Subtotal: $
						{lines
							.reduce(
								(acc, item, index) =>
									acc +
									Number(
										form.getValues(`lines.${index}.amount`),
									) *
										Number(
											form.getValues(
												`lines.${index}.quantity`,
											),
										),
								0,
							)
							.toFixed(2)}
					</p>

					<Button disabled={isPending} type="submit">
						{isPending ? (
							<>
								Updating document...
								<Spinner />
							</>
						) : (
							'Update Document'
						)}
					</Button>

					<BackToLink
						path={'/billing/manage/invoices'}
						place={'Invoices'}
					/>
				</FieldGroup>
			</form>

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
		</div>
	)
}
