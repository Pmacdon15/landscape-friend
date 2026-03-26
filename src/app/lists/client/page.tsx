import { Suspense } from 'react'
import AddClientFormContainer from '@/components/ui/client-list/add-client-form-container'
import ClientListClient from '@/components/ui/client-list/client-list-client'
import FormContainer from '@/components/ui/containers/form-container'
import ClientListAllFallback from '@/components/ui/fallbacks/client-list-all-fallback'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import SearchForm from '@/components/ui/search/search-form'
import { fetchOrgMembers } from '@/lib/dal/dal-org'
import { isOrgAdmin } from '@/lib/utils/clerk'
export default function page() {
	const orgMembersPromise = fetchOrgMembers()
	const isAdminPromise = isOrgAdmin()

	return (
		<>
			<FormContainer>
				<FormHeader text={'Client List'} />
				<Suspense fallback={<SearchFormFallBack />}>
					<SearchForm
						isAdminPromise={isAdminPromise}
						orgMembersPromise={orgMembersPromise}
					/>
				</Suspense>
			</FormContainer>

			<AddClientFormContainer />

			<Suspense fallback={<ClientListAllFallback />}>
				<ClientListClient
					isAdminPromise={isAdminPromise}
					orgMembersPromise={orgMembersPromise}
				/>
			</Suspense>
		</>
	)
}
