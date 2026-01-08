import { neon } from '@neondatabase/serverless'
import type z from 'zod'
import type { schemaAssign, schemaAssignSnow } from '../zod/schemas'

export async function changePriorityDb(
	orgId: string,
	assignmentId: number,
	newPriority: number,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	const currentAssignment = await sql`
    SELECT priority, service_type, user_id FROM assignments
    WHERE id = ${assignmentId};
  `

	const currentPriority = currentAssignment[0].priority
	const serviceType = currentAssignment[0].service_type
	const userId = currentAssignment[0].user_id

	if (newPriority === currentPriority) {
		return currentAssignment[0]
	}

	if (newPriority < currentPriority) {
		await sql`
      UPDATE assignments
      SET priority = priority + 1
      WHERE org_id = ${orgId} AND service_type = ${serviceType} 
        AND priority >= ${newPriority} AND priority < ${currentPriority}
		AND user_id = ${userId};
    `
	} else {
		await sql`
      UPDATE assignments
      SET priority = priority - 1
      WHERE org_id = ${orgId} AND service_type = ${serviceType} 
        AND priority > ${currentPriority} AND priority <= ${newPriority}
		AND user_id = ${userId};
    `
	}

	const result = await sql`
    UPDATE assignments
    SET priority = ${newPriority}
    WHERE id = ${assignmentId}
    RETURNING *;
  `

	return result[0]
}

export async function assignGrassCuttingDb(
	data: z.infer<typeof schemaAssign>,	
	addressId: number,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)

	const allAssignmentsForOrg = await sql`
		SELECT client_id, priority FROM assignments
		WHERE user_id = ${data.assignedTo} AND service_type = 'grass'
	`

	await unassignGrassCuttingDb(data.clientId)

	const priorityResult = allAssignmentsForOrg.filter(
		(a) => Number(a.client_id) === data.clientId,
	)

	const priorities = priorityResult.map((r) => r.priority)
	const maxPriority = priorities.length > 0 ? Math.max(...priorities) : 0
	const nextPriority = maxPriority + 1

	const result = await sql`
		INSERT INTO assignments(client_id, user_id,address_id, service_type, priority)
		SELECT ${data.clientId}, ${data.assignedTo}, ${addressId}, 'grass', ${nextPriority}
		FROM clients
		WHERE id = ${data.clientId} 
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
) {
	const sql = neon(`${process.env.DATABASE_URL} `)
	const result = await sql`
    DELETE FROM assignments
    WHERE client_id = ${clientId}
      AND service_type = 'grass'      
    RETURNING *;
  `
	return result
}

//MARK: Unassign snow clearing
export async function unassignSnowClearingDb(
	clientId: number,	
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	const result = await sql`
    DELETE FROM assignments
    WHERE client_id = ${clientId}
      AND service_type = 'snow'      
    RETURNING *;
  `
	return result
}
//MARK: Toggle snow client

export async function assignSnowClearingDb(
	data: z.infer<typeof schemaAssignSnow>,	
	addressId: number,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)

	// console.log('Assigning snow clearing for client:', data.clientId)
	// console.log('Organization ID:', organization_id)

	if (!data.clientId) {
		throw new Error('Client ID and organization ID are required')
	}

	const allAssignmentsForOrg = await sql`
		SELECT client_id, priority FROM assignments
		WHERE user_id = ${data.assignedTo} AND service_type = 'snow'
	`
	// console.log('All assignments for org:', allAssignmentsForOrg)

	await unassignSnowClearingDb(data.clientId)

	const priorities = allAssignmentsForOrg.map((a) => a.priority)
	const maxPriority = Math.max(0, ...priorities)
	const nextPriority = maxPriority + 1

	// console.log('Next priority:', nextPriority)

	const result = await sql`
			INSERT INTO assignments(client_id, user_id, address_id, service_type, priority)
			SELECT ${data.clientId}, ${data.assignedTo}, ${addressId}, 'snow', ${nextPriority}
			FROM clients
			WHERE id = ${data.clientId}
			RETURNING *;
		`
	// console.log('Assignment result:', result)

	if (!result || result.length === 0) {
		throw new Error('Assignment Failed')
	}

	return result
}
