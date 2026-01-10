import { neon } from '@neondatabase/serverless'
import type { ClientSiteMapImages } from '@/types/site-maps-types'

export async function fetchClientSiteMapImages(
	clientIds: number[],
): Promise<ClientSiteMapImages[]> {
	if (clientIds.length === 0) return []

	const sql = neon(String(process.env.DATABASE_URL))

	const result = await sql`
		SELECT 
			i.id,
			i.address_id,
			ca.address,
			i.imageURL,     
			i.isActive,
			ca.client_id
		FROM images i
		JOIN client_addresses ca ON ca.id = i.address_id
		WHERE ca.client_id = ANY(${clientIds})
		ORDER BY i.created_at DESC
	`

	return result as ClientSiteMapImages[]
}
