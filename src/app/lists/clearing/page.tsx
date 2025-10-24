import { Suspense } from 'react'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import SearchForm from '@/components/ui/search/search-form'
import { fetchSnowClearingClients } from '@/lib/dal/clients-dal'
import { fetchOrgMembers } from '@/lib/dal/dal-org'
import { isOrgAdmin } from '@/lib/utils/clerk'
import { parseClientListParams } from '@/lib/utils/params'
import ClientListService from '../../../components/ui/service-list/clients-list-service'

export default async function Page(props: PageProps<'/lists/clearing'>) {
	const [{ isAdmin }, params] = await Promise.all([
		isOrgAdmin(),
		props.searchParams,
	])

	const orgMembersPromise = fetchOrgMembers()

	const {
		page,
		searchTerm,
		serviceDate,
		searchTermIsServiced,
		searchTermAssignedTo,
	} = parseClientListParams(params)
	// const searchTermAssignedTo = String(params.assigned_to ?? userId);
	if (!serviceDate)
		return (
			<FormContainer>
				<FormHeader text={'Clearing List'} />
				<Suspense fallback={<SearchFormFallBack variant="clearing" />}>
					<SearchForm						
						orgMembersPromise={orgMembersPromise}
						variant="clearing"
					/>
				</Suspense>
				<FormHeader text={'No date query'} />
			</FormContainer>
		)

	const clientsPromise = fetchSnowClearingClients(
		page,
		searchTerm,
		serviceDate,
		searchTermIsServiced,
		searchTermAssignedTo,
	)

	return (
		<>
			<FormContainer>
				<FormHeader text={'Clearing List'} />
				<Suspense fallback={<SearchFormFallBack variant="clearing" />}>
					<SearchForm						
						orgMembersPromise={orgMembersPromise}
						variant="clearing"
					/>
				</Suspense>
			</FormContainer>
			<Suspense
				fallback={
					<FormContainer>
						<FormHeader text="Loading . . ." />
					</FormContainer>
				}
			>
				<ClientListService
					clientsPromise={clientsPromise}
					isAdmin={isAdmin}
					page={page}
					searchTermIsServiced={searchTermIsServiced}
					serviceDate={serviceDate}
					snow={true}
				/>
			</Suspense>
		</>
	)
}
