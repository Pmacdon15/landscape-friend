import FillFormContainer from '@/components/ui/containers/fill-form-container';
import FormContainer from '@/components/ui/containers/form-container';
import { FormSelector } from '@/components/ui/forms/form-selector'; // Import the new component
import FormHeader from '@/components/ui/header/form-header';
import { isOrgAdmin } from "@/lib/utils/clerk";

export default async function SendQuotePage() {
  const { orgId, userId } = await isOrgAdmin();
  const organizationId = orgId || userId;

  if (!organizationId) {    
    return <FormContainer><FormHeader text={'Error: Organization ID not found.'} /></FormContainer>;
  }

  return (
    <FormContainer>
      <FillFormContainer>
        <FormSelector organizationId={organizationId} />
      </FillFormContainer>
    </FormContainer >
  );
}
