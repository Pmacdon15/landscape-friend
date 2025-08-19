import FillFormContainer from '@/components/ui/containers/fill-form-container';
import FormContainer from '@/components/ui/containers/form-container';
import FormHeader from '@/components/ui/header/form-header';
import { CreateQuoteForm } from '@/components/ui/stripe-quote-form/create-quote-form';
import { isOrgAdmin } from "@/lib/webhooks";

export default async function SendQuotePage() {
  const { orgId, userId } = await isOrgAdmin();
  const organizationId = orgId || userId;

  if (!organizationId) {
    // Handle case where organizationId is not available
    return <FormContainer><FormHeader text={'Error: Organization ID not found.'} /></FormContainer>;
  }

  return (
    <FormContainer>
      <FillFormContainer>
        <FormHeader text={'Create Stripe Quote'} />
        <div className="p-4 border rounded-md shadow-sm">
          <CreateQuoteForm organizationId={organizationId} />
        </div>
      </FillFormContainer>
    </FormContainer >
  );
}
