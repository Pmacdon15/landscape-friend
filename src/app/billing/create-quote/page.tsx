import FillFormContainer from '@/components/ui/containers/fill-form-container';
import FormContainer from '@/components/ui/containers/form-container';
import { FormSelector } from '@/components/ui/forms/form-selector'; // Import the new component
import { fetchClientList } from '@/lib/dal/clients-dal';
import { isOrgAdmin } from "@/lib/utils/clerk";

export default function SendQuotePage() {
  const organizationIdPromise = isOrgAdmin().then(({ orgId, userId }) => orgId || userId);  
  const clientsPromise = fetchClientList()
  return (
    <FormContainer>
      <FillFormContainer>
        <FormSelector organizationIdPromise={organizationIdPromise} clientsPromise={clientsPromise}/>
      </FillFormContainer>
    </FormContainer >
  );
}
