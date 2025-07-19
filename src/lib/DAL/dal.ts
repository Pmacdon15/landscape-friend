import { Client } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function FetchAllClients(): Promise<Client[]> {
    const { orgId, userId } = await auth.protect();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await (sql`
        SELECT * FROM clients
        WHERE organization_id = ${orgId || userId};
    `) as Client[];
    return result;
}