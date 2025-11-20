import { Suspense } from 'react'
import {
	fetchCuttingClients,
	fetchSnowClearingClients,
} from '@/lib/dal/clients-dal'
import { parseClientListParams } from '@/lib/utils/params'
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
		<Suspense>
			<ClientCards
				clientsPromise={promiseToPass}
				isAdminPromise={isAdminPromise}
				parseClientListParamsPromise={parseClientListParamsPromise}
				snow={snow}
			/>
		</Suspense>
	)
}
