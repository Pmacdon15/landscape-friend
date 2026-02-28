import { Suspense } from 'react'
import {
	fetchCuttingClients,
	fetchSnowClearingClients,
} from '@/lib/dal/clients-dal'
import { parseClientListParams } from '@/lib/utils/params'
import ListsClearingClientCardsFallback from '../fallbacks/lists-clearing-client-cards-fallback'
import ClientCards from './client-details/client-cards'

export default async function ClientListService({
	snow = false,
	isAdminPromise,
	props,
}: {
	snow?: boolean
	isAdminPromise: Promise<{ isAdmin: boolean }>
	props: PageProps<'/lists/cutting'> | PageProps<'/lists/clearing'>
}) {
	const parseClientListParamsPromise = props.searchParams.then(
		(searchParams) => parseClientListParams(searchParams),
	)

	const promiseToPass = snow
		? parseClientListParamsPromise.then((param) =>
				fetchSnowClearingClients(
					param.searchTerm,
					param.serviceDate,
					param.searchTermIsServiced,
					param.searchTermAssignedTo,
				),
			)
		: parseClientListParamsPromise.then((param) =>
				fetchCuttingClients(
					param.searchTerm,
					param.serviceDate,
					param.searchTermIsServiced,
					param.searchTermAssignedTo,
				),
			)

	return (
		<Suspense fallback={<ListsClearingClientCardsFallback />}>
			<ClientCards
				clientsPromise={promiseToPass}
				isAdminPromise={isAdminPromise}
				pagePromise={parseClientListParamsPromise.then(
					(searchParams) => searchParams.page,
				)}
				parseClientListParamsPromise={parseClientListParamsPromise}
				snow={snow}
			/>
		</Suspense>
	)
}
