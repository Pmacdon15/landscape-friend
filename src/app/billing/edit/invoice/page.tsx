import FillFormContainer from '@/components/ui/containers/fill-form-container';
import FormContainer from '@/components/ui/containers/form-container';
import FormHeader from '@/components/ui/header/form-header';
import { EditInvoiceForm } from '@/components/ui/stripe-invoice-form/edit-invoice-form';
import { getInvoiceDAL } from '@/lib/dal/stripe-dal';
import { isOrgAdmin } from "@/lib/server-funtions/clerk";
import { SearchParams } from "@/types/types-params";

export default async function EditInvoicePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams
  const invoiceId = params.invoice as string
  if (!invoiceId) return <FormContainer><FormHeader text={'Error: Invoice ID not found.'} /></FormContainer>;

  const invoice = await getInvoiceDAL(invoiceId);

  if (!invoice) return <FormContainer><FormHeader text={'Error: Invoice not found.'} /></FormContainer>;

  return (
    <FormContainer>
      <FillFormContainer>
        <FormHeader text={'Edit Stripe Invoice'} />
        <div className="p-4 border rounded-md shadow-sm">
          <EditInvoiceForm invoice={invoice} />
        </div>
      </FillFormContainer>
    </FormContainer >
  );
}
