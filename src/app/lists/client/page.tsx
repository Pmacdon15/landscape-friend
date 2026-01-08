import { Suspense } from 'react'
import AddClientFormContainer from '@/components/ui/client-list/add-client-form-container'
import ClientListAll from '@/components/ui/client-list/client-list-all'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import SearchForm from '@/components/ui/search/search-form'
import { fetchAllClientsInfo } from '@/lib/dal/clients-dal'
import { fetchOrgMembers } from '@/lib/dal/dal-org'
import { isOrgAdmin } from '@/lib/utils/clerk'
import { parseClientListParams } from '@/lib/utils/params'

export default function page(props: PageProps<'/lists/client'>) {
	const orgMembersPromise = fetchOrgMembers()
	const isAdminPromise = isOrgAdmin()
	const searchParamsPromise = props.searchParams.then(parseClientListParams)
	const clientsPromise = props.searchParams
		.then(parseClientListParams)
		.then((params) =>
			fetchAllClientsInfo(
				params.page,
				params.searchTerm,
				params.searchTermCuttingWeek,
				params.searchTermCuttingDay,
				params.searchTermAssignedTo,
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
			<Suspense>
				<AddClientFormContainer isAdminPromise={isAdminPromise} />
			</Suspense>
			<Suspense
				fallback={
					<FormContainer>
						<FormHeader text="Loading . . ." />
					</FormContainer>
				}
			>
				<ClientListAll
					clientsPromise={clientsPromise}
					isAdminPromise={isAdminPromise}
					orgMembersPromise={orgMembersPromise}
					searchParamsPromise={searchParamsPromise}
				/>
			</Suspense>
		</>
	)
}
