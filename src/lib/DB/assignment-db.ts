import { neon } from '@neondatabase/serverless'

export async function changePriorityDb(
	assignmentId: number,
	newPriority: number,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	// Two-phase update to avoid UNIQUE constraint violations:
	// Phase 1: Move all assignments for this user/service to negative priorities
	// Phase 2: Renumber them sequentially with the moved item in its new position

	const result = await sql`
    WITH current_assignment AS (
      -- Get the assignment being moved
      SELECT id, user_id, service_type, priority 
      FROM assignments 
      WHERE id = ${assignmentId}
    ),
    all_assignments AS (
      -- Get all assignments for this user/service in current order
      SELECT 
        a.id,
        a.priority,
        ROW_NUMBER() OVER (ORDER BY a.priority) as position
      FROM assignments a
      CROSS JOIN current_assignment c
      WHERE a.user_id = c.user_id 
        AND a.service_type = c.service_type
    ),
    moved_position AS (
      SELECT position FROM all_assignments WHERE id = ${assignmentId}
    ),
    temp_negative AS (
      -- Phase 1: Move all to temporary negative priorities to avoid conflicts
      UPDATE assignments a
      SET priority = -a.id
      FROM current_assignment c
      WHERE a.user_id = c.user_id 
        AND a.service_type = c.service_type
      RETURNING a.id
    ),
    new_order AS (
      -- Calculate new priorities after the move
      SELECT 
        aa.id,
        CASE 
          -- The item being moved gets the new priority
          WHEN aa.id = ${assignmentId} THEN ${newPriority}
          -- Moving item down: items between old and new position shift up
          WHEN (SELECT position FROM moved_position) < ${newPriority}
            AND aa.position > (SELECT position FROM moved_position)
            AND aa.position <= ${newPriority}
            THEN aa.position - 1
          -- Moving item up: items between new and old position shift down  
          WHEN (SELECT position FROM moved_position) > ${newPriority}
            AND aa.position >= ${newPriority}
            AND aa.position < (SELECT position FROM moved_position)
            THEN aa.position + 1
          -- All other items stay in same position
          ELSE aa.position
        END as new_priority
      FROM all_assignments aa
    ),
    final_update AS (
      -- Phase 2: Set final priorities
      UPDATE assignments a
      SET priority = no.new_priority
      FROM new_order no
      WHERE a.id = no.id
      RETURNING a.*
    )
    SELECT * FROM final_update WHERE id = ${assignmentId};
  `
	return result[0]
}
