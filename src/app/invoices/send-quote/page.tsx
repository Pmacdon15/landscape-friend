import ContentContainer from '@/components/ui/containers/content-container';
import FormContainer from '@/components/ui/containers/form-container';
import FormHeader from '@/components/ui/header/form-header';
import { CreateQuoteForm } from '@/components/ui/stripe-quote-form/create-quote-form';

export default function SendQuotePage() {
  return (
    <FormContainer>
      <ContentContainer>
        <FormHeader text={'Create Stripe Quote'} />
        <div className="p-4 border rounded-md shadow-sm">
          <CreateQuoteForm />
        </div>
      </ContentContainer >
    </FormContainer >
  );
}
