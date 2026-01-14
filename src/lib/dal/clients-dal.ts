import { auth } from '@clerk/nextjs/server'
import { cacheTag } from 'next/cache'
import {
	fetchClientListDb,
	fetchClients,
	fetchClientsClearingGroupsDb,
	fetchClientsCuttingSchedules,
	fetchStripeCustomerNamesDB,
} from '@/lib/DB/clients-db'
import { fetchClientNamesAndEmailsDb } from '@/lib/DB/resend-db'
import { isOrgAdmin } from '@/lib/utils/clerk'
import type {
	ClientAssignment,
	ScheduledClient,
} from '@/types/assignment-types'
import type {
	Client,
	ClientAccount,
	ClientAddress,
	ClientInfoList,
	CustomerName,
	NamesAndEmails,
} from '@/types/clients-types'
import type { ClientCuttingSchedule } from '@/types/schedules-types'
import type { ClientSiteMapImages } from '@/types/site-maps-types'
import { getServicedImagesUrlsDb } from '../DB/db-get-images'
import { fetchClientSiteMapImages } from '../DB/sitemaps-db'

export async function fetchAllClientsInfo(
	clientPageNumber: number,
	searchTerm: string,
	searchTermCuttingWeek: number,
	searchTermCuttingDay: string,
	searchTermAssignedTo: string,
): Promise<{
	clients: Client[]
	addresses: ClientAddress[]
	accounts: ClientAccount[]
	assignments: ClientAssignment[]
	schedules: ClientCuttingSchedule[]
	siteMaps: ClientSiteMapImages[]
	totalPages: number
} | null> {
	'use cache: private'
	cacheTag(`clients-page-${clientPageNumber}`)
	const { orgId, userId, isAdmin } = await isOrgAdmin(true)
	if (!isAdmin) throw new Error('Not admin!')

	if (!userId) throw new Error('Not logged in!')
	const pageSize = Number(process.env.PAGE_SIZE) || 10
	const offset = (clientPageNumber - 1) * pageSize

	try {
		const allClientsInfo = await fetchClients(
			orgId || userId,
			pageSize,
			offset,
			searchTerm,
			searchTermCuttingWeek,
			searchTermCuttingDay,
			searchTermAssignedTo,
		)

		if (!allClientsInfo) {
			console.error('Failed to fetch clients')
			return null
		}

		const {
			clients,
			accounts,
			addresses,
			assignments,
			schedules,
			siteMaps: rawSiteMaps,
			totalPages,
		} = allClientsInfo

		const siteMaps = await convertSiteMapsToBase64(rawSiteMaps)

		return {
			clients,
			accounts,
			addresses,
			assignments,
			schedules,
			siteMaps,
			totalPages,
		}
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
): Promise<
	| {
			clientsSchedules: ScheduledClient[]
			siteMaps: ClientSiteMapImages[]
	  }
	| {
			errorMessage: string
	  }
> {
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

		const clientsSchedules = await fetchClientsCuttingSchedules(
			orgId || userId,
			searchTerm,
			cuttingDate || new Date(),
			searchTermIsCut,
			assignedTo,
		)

		const clientIds = clientsSchedules.map((client) => client.id)
		const rawSiteMaps = await fetchClientSiteMapImages(clientIds)
		const siteMaps = await convertSiteMapsToBase64(rawSiteMaps)

		return { clientsSchedules, siteMaps }
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
): Promise<
	| {
			clientsSchedules: ScheduledClient[]
			siteMaps: ClientSiteMapImages[]
	  }
	| {
			errorMessage: string
	  }
> {
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
		const clientsSchedules = await fetchClientsClearingGroupsDb(
			orgId || userId,
			searchTerm,
			clearingDate || new Date(),
			userId,
			searchTermIsServiced,
			searchTermAssignedTo,
		)

		// let clientIds
		// if('errorMessage' in result )throw new Error(" error Fetching from db")
		const clientIds = clientsSchedules.map((client) => client.id)
		const rawSiteMaps = await fetchClientSiteMapImages(clientIds)
		const siteMaps = await convertSiteMapsToBase64(rawSiteMaps)

		return { clientsSchedules, siteMaps }
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
	addressId: number,
): Promise<{ date: Date; base64Image: string }[]> {
	'use cache: private'
	cacheTag(`serviced-images-${addressId}`)
	await auth.protect()
	try {
		const images = await getServicedImagesUrlsDb(addressId)

		const base64Images = await Promise.all(
			images.map(async (img) => {
				try {
					const response = await fetch(img.imageurl)
					if (!response.ok) {
						throw new Error(
							`Failed to fetch image: ${response.statusText}`,
						)
					}
					const arrayBuffer = await response.arrayBuffer()
					const buffer = Buffer.from(arrayBuffer)
					const contentType =
						response.headers.get('content-type') || 'image/png'
					const base64 = buffer.toString('base64')
					return {
						date: img.date,
						base64Image: `data:${contentType};base64,${base64}`,
					}
				} catch (error) {
					console.error(
						`Error converting image ${img.imageurl} to base64:`,
						error,
					)
					return null
				}
			}),
		)

		return base64Images.filter(
			(img): img is { date: Date; base64Image: string } => img !== null,
		)
	} catch (error) {
		console.error('Error in getting Serviced Images Urls:', error)
		return []
	}
}

// Helper to convert site map images to base64
async function convertSiteMapsToBase64(
	siteMaps: ClientSiteMapImages[],
): Promise<ClientSiteMapImages[]> {
	return await Promise.all(
		siteMaps.map(async (sm) => {
			if (!sm.imageurl) return sm
			try {
				const response = await fetch(sm.imageurl)
				if (!response.ok) {
					throw new Error(
						`Failed to fetch image: ${response.statusText}`,
					)
				}
				const arrayBuffer = await response.arrayBuffer()
				const buffer = Buffer.from(arrayBuffer)
				const contentType =
					response.headers.get('content-type') || 'image/png'
				const base64String = buffer.toString('base64')
				return {
					...sm,
					base64Image: `data:${contentType};base64,${base64String}`,
				}
			} catch (error) {
				console.error(
					`Error converting sitemap image ${sm.imageurl} to base64:`,
					error,
				)
				return sm
			}
		}),
	)
}
