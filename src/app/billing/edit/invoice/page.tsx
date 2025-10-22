import FillFormContainer from '@/components/ui/containers/fill-form-container'
import FormContainer from '@/components/ui/containers/form-container'
import FormHeader from '@/components/ui/header/form-header'
import { EditForm } from '@/components/ui/stripe-forms/stripe-invoice-form/edit-form'
import { getInvoiceDAL } from '@/lib/dal/stripe-dal'
import type { SearchParams } from '@/types/params-types'

export default async function EditInvoicePage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>
}) {
	const params = await searchParams
	const invoiceId = params.invoice as string
	if (!invoiceId)
		return (
			<FormContainer>
				<FormHeader text={'Error: Invoice ID not found.'} />
			</FormContainer>
		)

	const invoice = await getInvoiceDAL(invoiceId)

	if (!invoice)
		return (
			<FormContainer>
				<FormHeader text={'Error: Invoice not found.'} />
			</FormContainer>
		)

	return (
		<FormContainer>
			<FillFormContainer>
				<FormHeader text={'Edit Invoice'} />
				<div className="p-4 border rounded-md shadow-sm">
					<EditForm invoice invoiceOrQuote={invoice} />
				</div>
			</FillFormContainer>
		</FormContainer>
	)
}
