import { auth } from '@clerk/nextjs/server'
import { cacheTag } from 'next/cache'
import {
	fetchClientListDb,
	fetchClientsClearingGroupsDb,
	fetchClientsCuttingSchedules,
	fetchClientsWithSchedules,
	fetchStripeCustomerNamesDB,
} from '@/lib/DB/clients-db'
import { fetchClientNamesAndEmailsDb } from '@/lib/DB/resend-db'
import { isOrgAdmin } from '@/lib/utils/clerk'
import type {
	ClientInfoList,
	ClientResult,
	ClientResultListClientPage,
	CustomerName,
	NamesAndEmails,
	PaginatedClients,
} from '@/types/clients-types'
import { getServicedImagesUrlsDb } from '../DB/db-get-images'
import { processClientsResult } from '../utils/sort'

export async function fetchAllClients(
	clientPageNumber: number,
	searchTerm: string,
	searchTermCuttingWeek: number,
	searchTermCuttingDay: string,
	searchTermAssignedTo: string,
): Promise<PaginatedClients | null> {
	'use cache: private'
	cacheTag(`clients`)
	const { orgId, userId, isAdmin } = await isOrgAdmin(true)
	if (!isAdmin) throw new Error('Not admin!')
	if (!userId) throw new Error('Not logged in!')
	const pageSize = Number(process.env.PAGE_SIZE) || 10
	const offset = (clientPageNumber - 1) * pageSize

	try {
		const result = await fetchClientsWithSchedules(
			orgId || userId,
			pageSize,
			offset,
			searchTerm,
			searchTermCuttingWeek,
			searchTermCuttingDay,
			searchTermAssignedTo,
		)

		if (!result.clientsResult) return null

		const { clients, totalPages } = processClientsResult(
			result.clientsResult as ClientResultListClientPage[],
			result.totalCount,
			pageSize,
		)
		return { clients, totalPages }
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(errorMessage)
		return null
	}
}

export async function fetchClientList(): Promise<ClientInfoList[] | []> {
	const { orgId, userId } = await isOrgAdmin(true)
	if (!userId) {
		throw new Error('Organization ID or User ID is missing.')
	}
	const organizationId = orgId
	if (!organizationId) {
		throw new Error('Organization ID or User ID is missing.')
	}
	try {
		const result = await fetchClientListDb(organizationId)
		if (!result) {
			return []
		}
		return result
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(errorMessage)
		return []
	}
}
export async function fetchCuttingClients(
	searchTerm: string,
	cuttingDate?: Date | undefined,
	searchTermIsCut?: boolean,
	searchTermAssignedTo?: string,
): Promise<ClientResult[] | { errorMessage: string }> {
	'use cache: private'
	cacheTag('grass-clients')
	const { orgId, userId, isAdmin } = await isOrgAdmin(true)

	if (!userId) return { errorMessage: 'User ID is missing.' }

	if (
		!isAdmin &&
		userId !== searchTermAssignedTo &&
		searchTermAssignedTo !== ''
	)
		return { errorMessage: 'Not admin can not view other coworkers list' }

	try {
		let assignedTo: string
		if (searchTermAssignedTo === '') assignedTo = userId
		else assignedTo = String(searchTermAssignedTo)

		if (!assignedTo)
			return { errorMessage: 'Can not search with no one assigned.' }

		const result = await fetchClientsCuttingSchedules(
			orgId || userId,
			searchTerm,
			cuttingDate || new Date(),
			searchTermIsCut,
			assignedTo,
		)

		return result
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(errorMessage)
		return { errorMessage: 'could not fetch cutting clients' }
	}
}
export async function fetchSnowClearingClients(
	searchTerm: string,
	clearingDate?: Date,
	searchTermIsServiced?: boolean,
	searchTermAssignedTo?: string,
): Promise<ClientResult[] | { errorMessage: string }> {
	'use cache: private'
	cacheTag('snow-clients')
	const { orgId, userId, isAdmin } = await isOrgAdmin(true)

	if (!userId) return { errorMessage: 'User ID is missing.' }

	if (
		!isAdmin &&
		userId !== searchTermAssignedTo &&
		searchTermAssignedTo !== ''
	) {
		return { errorMessage: 'Not admin can not view other coworkers list' }
	}

	try {
		const result = await fetchClientsClearingGroupsDb(
			orgId || userId,
			searchTerm,
			clearingDate || new Date(),
			userId,
			searchTermIsServiced,
			searchTermAssignedTo,
		)

		return result
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(errorMessage)
		return { errorMessage: 'Failed to fetch clearing clients' }
	}
}

export async function fetchClientsNamesAndEmails(): Promise<
	NamesAndEmails[] | { errorMessage: string }
> {
	const { orgId, userId } = await auth.protect()
	try {
		const result = await fetchClientNamesAndEmailsDb(orgId || userId)
		if (!result)
			return { errorMessage: 'DB Error fetching client names and email' }
		return result
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(errorMessage)
		return { errorMessage: 'An unknown error occurred' }
	}
}

export async function fetchClientNamesByStripeIds(
	stripeCustomerIds: string[],
): Promise<CustomerName[] | { errorMessage: string }> {
	const { orgId, userId } = await auth.protect()
	try {
		const result = await fetchStripeCustomerNamesDB(
			orgId || userId,
			stripeCustomerIds,
		)
		if (!result) return []
		return result
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(errorMessage)
		return { errorMessage: 'An unknown error occurred' }
	}
}

//MARK: Get Serviced URLs
export async function getServicedImagesUrls(
	clientId: number,
): Promise<{ date: Date; imageurl: string }[]> {
	await auth.protect()
	try {
		return await getServicedImagesUrlsDb(clientId)
	} catch (error) {
		console.error('Error in getting Serviced Images Urls:', error)
		return []
	}
}
