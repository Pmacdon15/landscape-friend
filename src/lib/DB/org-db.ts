import { neon } from '@neondatabase/serverless'

//MARK: Get organization settings
export async function getOrganizationSettings(
	organization_id: string,
): Promise<{ max_allowed_clients: number } | null> {
	const sql = neon(`${process.env.DATABASE_URL}`)
	const result = await sql`
    SELECT max_allowed_clients FROM organizations WHERE organization_id = ${organization_id}
  `
	if (result.length > 0) {
		return result[0] as { max_allowed_clients: number }
	}
	return null
}

export async function getAllOrganizations() {
	const sql = neon(`${process.env.DATABASE_URL}`)
	const result = await sql`
        SELECT organization_id FROM organizations;
    `
	return result
}

export async function handleOrganizationDeletedDb(orgId: string) {
	const sql = neon(`${process.env.DATABASE_URL}`)
	return await sql`
        DELETE FROM organizations
        WHERE organization_id = ${orgId} 
        RETURNING*;       
    `
}
