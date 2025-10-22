import FillFormContainer from '@/components/ui/containers/fill-form-container'
import FormContainer from '@/components/ui/containers/form-container'
import { FormSelector } from '@/components/ui/forms/form-selector' // Import the new component
import { fetchClientList } from '@/lib/dal/clients-dal'
import { fetchProducts } from '@/lib/dal/stripe-dal'
import { isOrgAdmin } from '@/lib/utils/clerk'

export default function SendQuotePage() {
	const organizationIdPromise = isOrgAdmin().then(
		({ orgId, userId }) => orgId || userId,
	)
	const clientsPromise = fetchClientList()
	const productsPromise = fetchProducts()
	return (
		<FormContainer>
			<FillFormContainer>
				<FormSelector
					clientsPromise={clientsPromise}
					organizationIdPromise={organizationIdPromise}
					productsPromise={productsPromise}
				/>
			</FillFormContainer>
		</FormContainer>
	)
}
