import { fetchServiceHistoryDB } from '@/lib/DB/service-history-db'
import { isOrgAdmin } from '@/lib/utils/clerk'
import type {
	ParsedServiceHistoryParams,
	ServiceHistoryResponse,
} from '@/types/service-history-types'

export async function fetchServiceHistory(
	params: ParsedServiceHistoryParams,
): Promise<ServiceHistoryResponse | null> {
	try {
		const { orgId, userId, isAdmin } = await isOrgAdmin(true)
		if (!isAdmin) throw new Error('Not admin!')

		if (!userId) throw new Error('Not logged in!')
		const organizationId = orgId || userId
		if (!organizationId) throw new Error('Organization ID is missing.')

		const limit = Number(process.env.PAGE_SIZE) || 10

		const { services, totalCount } = await fetchServiceHistoryDB(
			organizationId,
			params.page,
			params.search,
			params.serviceType,
			params.assignedTo,
			params.date,
			limit,
		)

		// Convert images to base64 to ensure they load consistently and securely
		const servicesWithBase64Images = await Promise.all(
			services.map(async (service) => {
				if (!service.image_url) return service
				try {
					const response = await fetch(service.image_url)
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
						...service,
						image_url: `data:${contentType};base64,${base64String}`,
					}
				} catch (error) {
					console.error(
						`Error converting service image ${service.image_url} to base64:`,
						error,
					)
					return service // fallback to the raw url if conversion fails
				}
			}),
		)

		return {
			services: servicesWithBase64Images,
			totalPages: Math.ceil(totalCount / limit),
			totalServices: totalCount,
		}
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(errorMessage)
		return null
	}
}
