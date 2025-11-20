import { Suspense } from 'react'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import SearchForm from '@/components/ui/search/search-form'
import { fetchOrgMembers } from '@/lib/dal/dal-org'
import { isOrgAdmin } from '@/lib/utils/clerk'
import ClientListService from '../../../components/ui/service-list/clients-list-service'

export default function Page(props: PageProps<'/lists/cutting'>) {
	const isAdminPromise = isOrgAdmin()
	const orgMembersPromise = fetchOrgMembers()

	return (
		<>
			<FormContainer>
				<FormHeader text={'Cutting List'} />
				<Suspense fallback={<SearchFormFallBack variant="cutting" />}>
					<SearchForm
						isAdminPromise={isAdminPromise}
						orgMembersPromise={orgMembersPromise}
						variant="cutting"
					/>
				</Suspense>
			</FormContainer>
			<ClientListService isAdminPromise={isAdminPromise} props={props} />
		</>
	)
}
