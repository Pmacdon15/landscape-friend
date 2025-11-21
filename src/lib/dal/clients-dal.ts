import { auth } from '@clerk/nextjs/server'
import { cacheTag } from 'next/cache'
import { db } from '@/lib/DB'
import { clients } from '@/lib/DB/schema'
import { eq } from 'drizzle-orm'
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
	ClientResultListCLientPage,
	CustomerName,
	NamesAndEmails,
	PaginatedClients,
} from '@/types/clients-types'
import { processClientsResult } from '../utils/sort'

export async function fetchAllClients(
	clientPageNumber: number,
	searchTerm: string,
	searchTermCuttingWeek: number,
	searchTermCuttingDay: string,
	searchTermAssignedTo: string,
): Promise<PaginatedClients | null> {
	const { orgId, userId, isAdmin } = await isOrgAdmin(true)
	if (!isAdmin) throw new Error('Not admin!')
	if (!userId) throw new Error('Not logged in!')
	const pageSize = Number(process.env.PAGE_SIZE) || 10
	const offset = (clientPageNumber - 1) * pageSize

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
		result.clientsResult as ClientResultListCLientPage[],
		result.totalCount,
		pageSize,
	)
	return { clients, totalPages }
}
//TODO: Abstract this
export async function fetchClientList(): Promise<ClientInfoList[]> {
	const { orgId, userId } = await isOrgAdmin(true)
	if (!userId) {
		throw new Error('Organization ID or User ID is missing.')
	}
	const organizationId = orgId || userId
	if (!organizationId) {
		throw new Error('Organization ID or User ID is missing.')
	}
	const result = await fetchClientListDb(organizationId)
	if (!result) {
		throw new Error('Failed to fetch client list.')
	}
	return result
}
export async function fetchCuttingClients(
	searchTerm: string,
	cuttingDate?: Date | undefined,
	searchTermIsCut?: boolean,
	searchTermAssignedTo?: string,
): Promise<ClientResult[] | null> {
	const { orgId, userId, isAdmin } = await isOrgAdmin(true)

	if (!userId) throw new Error(' User ID is missing.')

	if (!isAdmin && userId !== searchTermAssignedTo)
		throw new Error('Not admin can not view other coworkers list')

	let assignedTo: string
	if (searchTermAssignedTo === '') assignedTo = userId
	else assignedTo = String(searchTermAssignedTo)

	if (!assignedTo) throw new Error('Can not search with no one assigned.')

	const result = await fetchClientsCuttingSchedules(
		orgId || userId,
		searchTerm,
		cuttingDate || new Date(),
		searchTermIsCut,
		assignedTo,
	)

	return result
}
export async function fetchSnowClearingClients(
	searchTerm: string,
	clearingDate?: Date,
	searchTermIsServiced?: boolean,
	searchTermAssignedTo?: string,
): Promise<ClientResult[] | null> {
	'use cache: private'
	cacheTag('snow-clients')
	const { orgId, userId, isAdmin } = await isOrgAdmin(true)

	if (!userId) throw new Error('User ID is missing.')
	if (!isAdmin && userId !== searchTermAssignedTo)
		throw new Error('Not admin can not view other coworkers list')

	const result = await fetchClientsClearingGroupsDb(
		orgId || userId,
		searchTerm,
		clearingDate || new Date(),
		userId,
		searchTermIsServiced,
		searchTermAssignedTo,
	)

	return result
}

export async function fetchClientsNamesAndEmails(): Promise<
	NamesAndEmails[] | Error
> {
	const { orgId, userId } = await auth.protect()
	try {
		const result = await fetchClientNamesAndEmailsDb(orgId || userId)
		if (!result) return []
		return result
	} catch (e) {
		if (e instanceof Error) return e
		return new Error('An unknown error occurred') // Return a generic error
	}
}

export async function fetchClientNamesByStripeIds(
	stripeCustomerIds: string[],
): Promise<CustomerName[] | Error> {
	const { orgId, userId } = await auth.protect()
	try {
		const result = await fetchStripeCustomerNamesDB(
			orgId || userId,
			stripeCustomerIds,
		)
		if (!result) return []
		return result
	} catch (e) {
		if (e instanceof Error) return e
		return new Error('An unknown error occurred')
	}
}
