
import { neon } from "@neondatabase/serverless";

export async function getSnowClients() {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`
        SELECT
            c.id as client_id,
            c.address,
            u.id as user_id,
            u.novu_subscriber_id
        FROM
            assignments a
        JOIN
            clients c ON a.client_id = c.id
        JOIN
            users u ON a.user_id = u.id
        WHERE
            a.service_type = 'snow';
    `;
    return result;
}
