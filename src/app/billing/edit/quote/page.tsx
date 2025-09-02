import FillFormContainer from '@/components/ui/containers/fill-form-container';
import FormContainer from '@/components/ui/containers/form-container';
import FormHeader from '@/components/ui/header/form-header';
import { EditForm } from '@/components/ui/stripe-forms/stripe-invoice-form/edit-form';
import { getQuoteDAL } from '@/lib/dal/stripe-dal';
import { SearchParams } from "@/types/params-types";

export default async function EditInvoicePage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams
    const quoteId = params.quote as string
    if (!quoteId) return <FormContainer><FormHeader text={'Error: Invoice ID not found.'} /></FormContainer>;

    const quote = await getQuoteDAL(quoteId);

    if (!quote) return <FormContainer><FormHeader text={'Error: Invoice not found.'} /></FormContainer>;

    return (
        <FormContainer>
            <FillFormContainer>
                <FormHeader text={'Edit Quote'} />
                <div className="p-4 border rounded-md shadow-sm">
                    <EditForm invoiceOrQuote={quote} />
                </div>
            </FillFormContainer>
        </FormContainer >
    );
}
