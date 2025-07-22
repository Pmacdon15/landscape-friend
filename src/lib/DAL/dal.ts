import { Client } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

// export async function FetchAllClients(): Promise<Client[]> {
//     const { orgId, userId } = await auth.protect();
//     const sql = neon(`${process.env.DATABASE_URL}`);
//     const result = await (sql`
//         SELECT * FROM clients
//         WHERE organization_id = ${orgId || userId};
//     `) as Client[];
//     return result;
// }

export async function FetchAllClients(): Promise<Client[]> {
    const { orgId, userId } = await auth.protect();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await (sql`
        SELECT c.*, a.current_balance AS amount_owing
        FROM clients c
        JOIN accounts a ON c.id = a.client_id
        WHERE c.organization_id = ${orgId || userId};
    `) as Client[];
    return result;
}