import { Suspense } from 'react'
import AddClientFormContainer from '@/components/ui/client-list/add-client-form-container'
import ClientListAll from '@/components/ui/client-list/client-list-all'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import SearchForm from '@/components/ui/search/search-form'
import { fetchAllClients } from '@/lib/dal/clients-dal'
import { fetchOrgMembers } from '@/lib/dal/dal-org'
import { isOrgAdmin } from '@/lib/utils/clerk'
import { parseClientListParams } from '@/lib/utils/params'
import type { SearchParams } from '@/types/params-types'

export default async function page({
	searchParams,
}: {
	searchParams: Promise<SearchParams>
}) {
	const [{ isAdmin }, params] = await Promise.all([
		isOrgAdmin(),
		searchParams,
	])

	const {
		page,
		searchTerm,
		searchTermCuttingWeek,
		searchTermCuttingDay,
		searchTermAssignedTo,
	} = parseClientListParams(params)
	const clientsPromise = fetchAllClients(
		page,
		searchTerm,
		searchTermCuttingWeek,
		searchTermCuttingDay,
		searchTermAssignedTo,
	)
	const orgMembersPromise = fetchOrgMembers()

	return (
		<>
			<FormContainer>
				<FormHeader text={'Client List'} />
				<Suspense fallback={<SearchFormFallBack />}>
					<SearchForm
						isAdmin={isAdmin}
						orgMembersPromise={orgMembersPromise}
					/>
				</Suspense>
			</FormContainer>
			{isAdmin && <AddClientFormContainer />}
			<Suspense
				fallback={
					<FormContainer>
						<FormHeader text="Loading . . ." />
					</FormContainer>
				}
			>
				<ClientListAll
					clientsPromise={clientsPromise}
					isAdmin={isAdmin}
					orgMembersPromise={orgMembersPromise}
					page={page}
				/>
			</Suspense>
		</>
	)
}
