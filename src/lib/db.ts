import { Client } from "@/types/types";
import { schemaAddClient } from "./zod/schemas";
import { neon } from "@neondatabase/serverless";
import z from "zod";
import revalidatePathAction from "@/actions/revalidatePath";

export async function addClientDB(data: z.infer<typeof schemaAddClient>, organization_id: string): Promise<Client[]> {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await (sql`
        INSERT INTO clients (full_name, email_address, organization_id, client_address)
        VALUES (${data.full_name}, ${data.email_address}, ${organization_id},  ${data.address})
        RETURNING *;
    `) as Client[];

    if (result) revalidatePathAction("/client-list")
    return result;
}