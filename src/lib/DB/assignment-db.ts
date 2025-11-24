import { neon } from '@neondatabase/serverless'
import type z from 'zod'
import type { schemaAssign, schemaAssignSnow } from '../zod/schemas'
export async function changePriorityDb(
	orgId: string,
	assignmentId: number,
	newPriority: number,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	await sql`
    UPDATE assignments
    SET priority = priority + 1
    WHERE org_id = ${orgId} AND service_type = 'snow' AND priority >= ${newPriority};
  `

	await sql`
    UPDATE assignments
    SET priority = ${newPriority}
    WHERE id = ${assignmentId};
  `

	const result = await sql`
    SELECT * FROM assignments
    WHERE id = ${assignmentId};
  `

	return result[0]
}
export async function assignGrassCuttingDb(
	data: z.infer<typeof schemaAssign>,
	organization_id: string,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)

	const allAssignmentsForOrg = await sql`
		SELECT client_id, priority FROM assignments
		WHERE org_id = ${organization_id} AND service_type = 'grass'
	`

	const priorityResult = allAssignmentsForOrg.filter(
		(a) => Number(a.client_id) === data.clientId,
	)

	const priorities = priorityResult.map((r) => r.priority)
	const maxPriority = priorities.length > 0 ? Math.max(...priorities) : 0
	const nextPriority = maxPriority + 1

	const result = await sql`
		INSERT INTO assignments(client_id, org_id, user_id, service_type, priority)
		SELECT ${data.clientId}, ${organization_id}, ${data.assignedTo}, 'grass', ${nextPriority}
		FROM clients
		WHERE id = ${data.clientId} AND organization_id = ${organization_id}
		RETURNING *;
	`

	if (!result || result.length === 0) {
		throw new Error('Assignment Failed')
	}

	return result
}

//MARK: Unassign grass cutting
export async function unassignGrassCuttingDb(
	clientId: number,
	organization_id: string,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)
	const result = await sql`
    DELETE FROM assignments
    WHERE client_id = ${clientId}
      AND service_type = 'grass'
      AND org_id = ${organization_id}
    RETURNING *;
  `
	return result
}

//MARK: Unassign snow clearing
export async function unassignSnowClearingDb(
	clientId: number,
	organization_id: string,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	const result = await sql`
    DELETE FROM assignments
    WHERE client_id = ${clientId}
      AND service_type = 'snow'
      AND org_id = ${organization_id}
    RETURNING *;
  `
	return result
}
//MARK: Toggle snow client

export async function assignSnowClearingDb(
	data: z.infer<typeof schemaAssignSnow>,
	organization_id: string,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)

	console.log('Assigning snow clearing for client:', data.clientId)
	console.log('Organization ID:', organization_id)

	if (!data.clientId || !organization_id) {
		throw new Error('Client ID and organization ID are required')
	}

	const allAssignmentsForOrg = await sql`
		SELECT client_id, priority FROM assignments
		WHERE org_id = ${organization_id} AND service_type = 'snow'
	`
	console.log('All assignments for org:', allAssignmentsForOrg);

	const priorities = allAssignmentsForOrg.map(a => a.priority);
	const maxPriority = Math.max(0, ...priorities);
	const nextPriority = maxPriority + 1;

	console.log('Next priority:', nextPriority)

	const result = await sql`
    INSERT INTO assignments(client_id, org_id, user_id, service_type, priority)
    SELECT ${data.clientId}, ${organization_id}, ${data.assignedTo}, 'snow', ${nextPriority}
    FROM clients
    WHERE id = ${data.clientId} AND organization_id = ${organization_id}
    RETURNING *;
  `
	console.log('Assignment result:', result)

	if (!result || result.length === 0) {
		throw new Error('Assignment Failed')
	}

	return result
}