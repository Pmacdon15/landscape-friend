import SearchForm from '@/components/ui/search/search-form'
import FormContainer from '@/components/ui/containers/form-container'
import FormHeader from '@/components/ui/header/form-header'
import ClientListService from '../../../components/ui/service-list/clients-list-service'
import { fetchSnowClearingClients } from '@/lib/dal/clients-dal'
import { isOrgAdmin } from '@/lib/utils/clerk'
import { Suspense } from 'react'
import { parseClientListParams } from '@/lib/utils/params'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import { fetchOrgMembers } from '@/lib/dal/dal-org'

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
						variant="clearing"
						orgMembersPromise={orgMembersPromise}
						isAdmin={isAdmin}
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
						variant="clearing"
						orgMembersPromise={orgMembersPromise}
						isAdmin={isAdmin}
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
					page={page}
					serviceDate={serviceDate}
					searchTermIsServiced={searchTermIsServiced}
					snow={true}
					isAdmin={isAdmin}
				/>
			</Suspense>
		</>
	)
}
