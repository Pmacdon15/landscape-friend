import { neon } from '@neondatabase/serverless'
import type { ServiceHistoryItem } from '@/types/service-history-types'

export async function fetchServiceHistoryDB(
	organizationId: string,
	page: number,
	searchTerm: string,
	serviceType: string,
	assignedTo: string,
	dateStr: string,
	limit: number = 10,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)
	const offset = (page - 1) * limit

	// Build the filtering conditions for each subquery
	let searchFilter = sql`1=1`
	if (searchTerm) {
		const searchPattern = `%${searchTerm}%`
		searchFilter = sql`(c.full_name ILIKE ${searchPattern} OR ca.address ILIKE ${searchPattern})`
	}

	let dateFilterCut = sql`1=1`
	let dateFilterClear = sql`1=1`
	
	if (dateStr) {
		dateFilterCut = sql`ymc.cutting_date = ${dateStr}`
		dateFilterClear = sql`ymcl.clearing_date = ${dateStr}`
	}

	
	const cutQuery = sql`
		SELECT
			'grass' as service_type,
			ymc.id as service_id,
			ymc.cutting_date as service_date,
			ymc.address_id,
			ymc.assigned_to as assigned_to_id,
			ca.address,
			c.id as client_id,
			c.full_name as client_name,
			c.organization_id,
			COALESCE(u.name, ymc.assigned_to) as assigned_to_name,
			img.imageurl as image_url
		FROM yards_marked_cut ymc
		JOIN client_addresses ca ON ymc.address_id = ca.id
		JOIN clients c ON ca.client_id = c.id
		LEFT JOIN users u ON ymc.assigned_to = u.id
		LEFT JOIN images_serviced img ON ymc.id = img.fk_cut_id
		WHERE c.organization_id = ${organizationId}
		  AND ${searchFilter}
		  AND ${dateFilterCut}
		  AND (u.name ILIKE ${assignedTo ? `%${assignedTo}%` : '%'} OR ymc.assigned_to ILIKE ${assignedTo ? `%${assignedTo}%` : '%'})
	`

	const clearQuery = sql`
		SELECT
			'snow' as service_type,
			ymcl.id as service_id,
			ymcl.clearing_date as service_date,
			ymcl.address_id,
			ymcl.assigned_to as assigned_to_id,
			ca.address,
			c.id as client_id,
			c.full_name as client_name,
			c.organization_id,
			COALESCE(u.name, ymcl.assigned_to) as assigned_to_name,
			img.imageurl as image_url
		FROM yards_marked_clear ymcl
		JOIN client_addresses ca ON ymcl.address_id = ca.id
		JOIN clients c ON ca.client_id = c.id
		LEFT JOIN users u ON ymcl.assigned_to = u.id
		LEFT JOIN images_serviced img ON ymcl.id = img.fk_clear_id
		WHERE c.organization_id = ${organizationId}
		  AND ${searchFilter}
		  AND ${dateFilterClear}
		  AND (u.name ILIKE ${assignedTo ? `%${assignedTo}%` : '%'} OR ymcl.assigned_to ILIKE ${assignedTo ? `%${assignedTo}%` : '%'})
	`

	let combinedQuery: any
	if (serviceType === 'grass') {
		combinedQuery = sql`
			SELECT * FROM (${cutQuery}) AS combined
		`
	} else if (serviceType === 'snow') {
		combinedQuery = sql`
			SELECT * FROM (${clearQuery}) AS combined
		`
	} else {
		combinedQuery = sql`
			SELECT * FROM (${cutQuery} UNION ALL ${clearQuery}) AS combined
		`
	}

	const paginatedQuery = sql`
		${combinedQuery}
		ORDER BY service_date DESC, service_id DESC
		LIMIT ${limit} OFFSET ${offset}
	`

	const countQuery = sql`
		SELECT COUNT(*) as total_count FROM (${combinedQuery}) as subquery
	`

	const [servicesResult, countResult] = await Promise.all([
		paginatedQuery,
		countQuery
	])

	// The id needs to be generated generically for the client array mapped list.
	// We'll map them after.
	const services = servicesResult.map((row: Record<string, any>, i: number) => ({
		id: row.service_id * 1000 + (row.service_type === 'grass' ? 1 : 2) + offset + i, // Unique react list key generator fallback
		service_id: row.service_id,
		service_type: row.service_type,
		service_date: new Date(row.service_date).toISOString().split('T')[0],
		address_id: row.address_id,
		address: row.address,
		assigned_to_id: row.assigned_to_id,
		assigned_to_name: row.assigned_to_name,
		client_id: row.client_id,
		client_name: row.client_name,
		organization_id: row.organization_id,
		image_url: row.image_url,
	})) as ServiceHistoryItem[]

	const totalCount = Number(countResult[0]?.total_count || 0)

	return {
		services,
		totalCount,
	}
}
