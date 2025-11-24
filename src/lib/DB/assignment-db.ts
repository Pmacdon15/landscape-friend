import { neon } from '@neondatabase/serverless'
import type z from 'zod'
import type { schemaAssign, schemaAssignSnow } from '../zod/schemas'
export async function changePriorityDb(
	orgId: string,
	assignmentId: number,
	newPriority: number,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	const result = await sql`
    WITH target AS (
      SELECT client_id, service_type 
      FROM assignments 
      WHERE id = ${assignmentId} AND org_id = ${orgId}
    ),
    ordered AS (
      SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY priority) AS pos
      FROM assignments a
      JOIN target t 
        ON a.client_id = t.client_id
       AND a.service_type = t.service_type
       AND a.org_id = ${orgId}
    ),
    removed AS (
      -- remove the target from the list
      SELECT id
      FROM ordered
      WHERE id <> ${assignmentId}
    ),
    reinsert AS (
      -- build the new list with the target inserted at the new position
      SELECT id, 
             ROW_NUMBER() OVER (ORDER BY (pos >= ${newPriority})::int, pos) AS new_pos
      FROM (
        SELECT id, pos FROM ordered WHERE id = ${assignmentId}
        UNION ALL
        SELECT id, pos FROM removed
      ) x
    ),
    updated AS (
      UPDATE assignments a
      SET priority = r.new_pos
      FROM reinsert r
      WHERE a.id = r.id AND a.org_id = ${orgId}
      RETURNING a.*
    )
    SELECT * FROM updated WHERE id = ${assignmentId};
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