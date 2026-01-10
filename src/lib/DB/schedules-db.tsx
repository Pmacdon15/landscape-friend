import { neon } from '@neondatabase/serverless'
import type { ClientCuttingSchedule } from '@/types/schedules-types'

export async function fetchClientSchedules(
	clientIds: number[],
): Promise<ClientCuttingSchedule[]> {
	if (clientIds.length === 0) return []

	const sql = neon(`${process.env.DATABASE_URL}`)

	const result = await sql`
        SELECT cs.*
        FROM cutting_schedule cs
        JOIN client_addresses ca
            ON ca.id = cs.address_id
        WHERE ca.client_id = ANY(${clientIds})
    `

	return result as ClientCuttingSchedule[]
}
