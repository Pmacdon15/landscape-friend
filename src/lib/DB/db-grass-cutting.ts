import { neon } from "@neondatabase/serverless";
import { schemaAssign } from "../zod/schemas";
import z from "zod";

export async function assignGrassCuttingDb(data: z.infer<typeof schemaAssign>, organization_id: string) {
    const sql = neon(`${process.env.DATABASE_URL} `);

    const result = await sql`
     INSERT INTO cutting_schedule(client_id, assigned_to, organization_id)
     SELECT ${data.clientId}, ${data.assignedTo}, ${organization_id}
     FROM clients
     WHERE id = ${data.clientId} AND organization_id = ${organization_id}
     ON CONFLICT(client_id) DO UPDATE
     SET assigned_to = EXCLUDED.assigned_to
     RETURNING *;
     `;

    if (!result || result.length === 0) {
        throw new Error('Assignment Failed');
    }

    return result;
}
