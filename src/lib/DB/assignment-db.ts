import { neon } from "@neondatabase/serverless"

export async function changePriorityDb(
  assignmentId: number,
  newPriority: number,
  
) {
  const sql = neon(`${process.env.DATABASE_URL}`)
  const result = await sql`
    WITH current_assignment AS (
      SELECT client_id, service_type, priority 
      FROM assignments 
      WHERE id = ${assignmentId}
    ),
    updates AS (
      UPDATE assignments a
      SET priority = CASE
        WHEN a.id = ${assignmentId} THEN ${newPriority}
        WHEN a.priority > (SELECT priority FROM current_assignment) AND a.priority <= ${newPriority} THEN a.priority - 1
        WHEN a.priority < (SELECT priority FROM current_assignment) AND a.priority >= ${newPriority} THEN a.priority + 1
        ELSE a.priority
      END
      FROM current_assignment c
      WHERE a.client_id = c.client_id AND a.service_type = c.service_type
      RETURNING *
    )
    SELECT * FROM updates WHERE id = ${assignmentId};
  `
  return result[0]
}