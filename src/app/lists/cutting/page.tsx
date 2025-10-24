import { Suspense } from 'react'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import SearchForm from '@/components/ui/search/search-form'
import { fetchCuttingClients } from '@/lib/dal/clients-dal'
import { fetchOrgMembers } from '@/lib/dal/dal-org'
import { isOrgAdmin } from '@/lib/utils/clerk'
import { parseClientListParams } from '@/lib/utils/params'
import ClientListService from '../../../components/ui/service-list/clients-list-service'

export default async function Page(props: PageProps<'/lists/cutting'>) {
	const [{ isAdmin }, params] = await Promise.all([
		isOrgAdmin(),
		props.searchParams,
	])

	const {
		page,
		searchTerm,
		serviceDate,
		searchTermIsServiced,
		searchTermAssignedTo,
	} = parseClientListParams(params)

	const clientsPromise = serviceDate
		? fetchCuttingClients(
				page,
				searchTerm,
				serviceDate,
				searchTermIsServiced,
				searchTermAssignedTo,
			)
		: Promise.resolve(null)
	const orgMembersPromise = fetchOrgMembers()
	return (
		<>
			<FormContainer>
				<FormHeader text={'Cutting List'} />
				<Suspense fallback={<SearchFormFallBack variant="cutting" />}>
					<SearchForm						
						orgMembersPromise={orgMembersPromise}
						variant="cutting"
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
				/>
			</Suspense>
		</>
	)
}
