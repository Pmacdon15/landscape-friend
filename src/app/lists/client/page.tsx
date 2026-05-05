import { Suspense } from 'react'
import AddClientFormContainer from '@/components/ui/client-list/add-client-form-container'
import ClientListClient from '@/components/ui/client-list/client-list-client'
import FormContainer from '@/components/ui/containers/form-container'
import ClientListAllFallback from '@/components/ui/fallbacks/client-list-all-fallback'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import SearchForm from '@/components/ui/search/search-form'
import { fetchAllClientsInfo } from '@/lib/dal/clients-dal'
import { fetchOrgMembers } from '@/lib/dal/dal-org'
import { isOrgAdmin } from '@/lib/utils/clerk'

function parseProp(prop: string[] | string | undefined): string {
	return Array.isArray(prop) ? (prop[0] ?? '') : (prop ?? '')
}

export default async function page(props: PageProps<'/lists/client'>) {
	const pagePromise = props.searchParams.then(
		(params) => Number(parseProp(params.page)) || 1,
	)
	const orgMembersPromise = fetchOrgMembers()
	const isAdminPromise = isOrgAdmin()
	const clientsPromise = props.searchParams.then((params) =>
		fetchAllClientsInfo(
			Number(parseProp(params.page)) || 1,
			parseProp(params.search),
			Number(parseProp(params.week)) || 0,
			parseProp(params.day) === 'all' ? '' : parseProp(params.day),
			parseProp(params.assigned) === 'all' ? '' : parseProp(params.assigned),
		),
	)

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
					clientsPromise={clientsPromise}
					isAdminPromise={isAdminPromise}
					orgMembersPromise={orgMembersPromise}
					pagePromise={pagePromise}
				/>
			</Suspense>
		</>
	)
}
