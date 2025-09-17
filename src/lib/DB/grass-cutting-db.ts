import { neon } from "@neondatabase/serverless";
import { schemaAssign } from "../zod/schemas";
import z from "zod";

// export async function assignGrassCuttingDb(data: z.infer<typeof schemaAssign>, organization_id: string) {
//     const sql = neon(`${process.env.DATABASE_URL} `);

//     const result = await sql`
//      INSERT INTO cutting_schedule(client_id, assigned_to, organization_id, cutting_week, cutting_day)
//      SELECT ${data.clientId}, ${data.assignedTo}, ${organization_id}, ${data.cuttingWeek}, ${data.cuttingDay}
//      FROM clients
//      WHERE id = ${data.clientId} AND organization_id = ${organization_id}
//      ON CONFLICT(client_id, cutting_week, organization_id) DO UPDATE
//      SET assigned_to = EXCLUDED.assigned_to, cutting_day = EXCLUDED.cutting_day
//      RETURNING *;
//      `;

//     if (!result || result.length === 0) {
//         throw new Error('Assignment Failed');
//     }

//     return result;
// }

export async function getYardsCutLastMonth(organization_id: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await sql`
        SELECT
            c.id as client_id,
            c.stripe_customer_id,
            c.price_per_cut,
            COUNT(ymc.id) as cut_count
        FROM
            clients c
        JOIN
            yards_marked_cut ymc ON c.id = ymc.client_id
        WHERE
            c.organization_id = ${organization_id} AND
            ymc.cutting_date >= ${thirtyDaysAgo.toISOString().split('T')[0]}
        GROUP BY
            c.id, c.stripe_customer_id, c.price_per_cut;
    `;

    return result;
}

export async function getTodaysCuts(cuttingWeek: number, cuttingDay: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`
        SELECT
            c.full_name as client_name,
            u.id as user_id,
            u.novu_subscriber_id
        FROM
            cutting_schedule cs
        JOIN
            clients c ON cs.client_id = c.id
        JOIN
            assignments a ON c.id = a.client_id AND a.service_type = 'grass'
        JOIN
            users u ON a.user_id = u.id
        WHERE
            cs.cutting_week = ${cuttingWeek} AND cs.cutting_day = ${cuttingDay};
    `;
    return result;
}