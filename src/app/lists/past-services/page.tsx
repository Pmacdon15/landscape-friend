import { Suspense } from 'react'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import Spinner from '@/components/ui/loaders/spinner'
import ServiceHistoryClient from '@/components/ui/service-history/service-history-client'
import ServiceHistoryFilters from '@/components/ui/service-history/service-history-filters'
import { fetchOrgMembers } from '@/lib/dal/dal-org'
import { isOrgAdmin } from '@/lib/utils/clerk'

export default function PastServicesPage() {
	const orgMembersPromise = fetchOrgMembers()
	const isAdminPromise = isOrgAdmin()

	return (
		<>
			<FormContainer>
				<FormHeader text={'Past Services'} />
				<Suspense fallback={<SearchFormFallBack />}>
					<ServiceHistoryFilters
						isAdminPromise={isAdminPromise}
						orgMembersPromise={orgMembersPromise}
					/>
				</Suspense>
			</FormContainer>

			<Suspense
				fallback={
					<div className="flex w-full justify-center p-8 text-gray-500">
						Loading past services <Spinner />
					</div>
				}
			>
				<ServiceHistoryClient />
			</Suspense>
		</>
	)
}
