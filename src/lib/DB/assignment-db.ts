import { neon } from '@neondatabase/serverless'
import type z from 'zod'
import type { ClientAssignment } from '@/types/assignment-types'
import type { schemaAssign, schemaAssignSnow } from '../zod/schemas'
export async function changePriorityDb(
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
      WHERE service_type = ${serviceType} 
        AND priority >= ${newPriority} AND priority < ${currentPriority}
		AND user_id = ${userId};
    `
	} else {
		await sql`
      UPDATE assignments
      SET priority = priority - 1
      WHERE service_type = ${serviceType} 
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

	const allAssignmentsForUser = await sql`
		SELECT address_id, priority FROM assignments
		WHERE user_id = ${data.assignedTo} AND service_type = 'grass'
	`

	await unassignGrassCuttingDb(addressId)

	const priorities = allAssignmentsForUser.map((r) => r.priority)
	const maxPriority = priorities.length > 0 ? Math.max(...priorities) : 0
	const nextPriority = maxPriority + 1

	const result = await sql`
	INSERT INTO assignments (
		user_id,
		address_id,
		service_type,
		priority
	)
	VALUES (
		${data.assignedTo},
		${addressId},
		'grass',
		${nextPriority}
	)
	RETURNING *;
`

	if (!result || result.length === 0) {
		throw new Error('Assignment Failed')
	}

	return result
}

//MARK: Unassign grass cutting
export async function unassignGrassCuttingDb(addressId: number) {
	const sql = neon(`${process.env.DATABASE_URL} `)
	const result = await sql`
    DELETE FROM assignments
    WHERE address_id = ${addressId}
      AND service_type = 'grass'      
    RETURNING *;
  `
	return result
}

//MARK: Unassign snow clearing
export async function unassignSnowClearingDb(addressId: number) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	const result = await sql`
    DELETE FROM assignments
    WHERE address_id = ${addressId}
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
	const allAssignmentsForUser = await sql`
		SELECT address_id, priority FROM assignments
		WHERE user_id = ${data.assignedTo} AND service_type = 'snow'
	`

	await unassignSnowClearingDb(addressId)

	const priorities = allAssignmentsForUser.map((a) => a.priority)
	const maxPriority = Math.max(0, ...priorities)
	const nextPriority = maxPriority + 1

	// console.log('Next priority:', nextPriority)

	const result = await sql`
	INSERT INTO assignments (
		user_id,
		address_id,
		service_type,
		priority
	)
	VALUES (
		${data.assignedTo},
		${addressId},
		'snow',
		${nextPriority}
	)
	RETURNING *;
`
	// console.log('Assignment result:', result)

	if (!result || result.length === 0) {
		throw new Error('Assignment Failed')
	}

	return result
}

export async function fetchClientAssignments(
	clientIds: number[],
): Promise<ClientAssignment[]> {
	if (clientIds.length === 0) return []

	const sql = neon(`${process.env.DATABASE_URL}`)

	const result = await sql`
		SELECT a.*
		FROM assignments a
		JOIN client_addresses ca
			ON ca.id = a.address_id
		WHERE ca.client_id = ANY(${clientIds})
		ORDER BY a.user_id, a.service_type, a.priority
	`

	return result as ClientAssignment[]
}
