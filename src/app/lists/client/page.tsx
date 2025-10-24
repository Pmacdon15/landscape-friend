import { Suspense } from 'react'
import AddClientFormContainer from '@/components/ui/client-list/add-client-form-container'
import ClientListAll from '@/components/ui/client-list/client-list-all'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import SearchForm from '@/components/ui/search/search-form'
import { fetchOrgMembers } from '@/lib/dal/dal-org'

export default function page(props: PageProps<'/lists/client'>) {
	const orgMembersPromise = fetchOrgMembers()
	return (
		<>
			<FormContainer>
				<FormHeader text={'Client List'} />
				<Suspense fallback={<SearchFormFallBack />}>
					<SearchForm orgMembersPromise={orgMembersPromise} />
				</Suspense>
			</FormContainer>
			<Suspense>
				<AddClientFormContainer />
			</Suspense>
			<Suspense
				fallback={
					<FormContainer>
						<FormHeader text="Loading . . ." />
					</FormContainer>
				}
			>
				<ClientListAll
					orgMembersPromise={orgMembersPromise}
					props={props}
				/>
			</Suspense>
		</>
	)
}
