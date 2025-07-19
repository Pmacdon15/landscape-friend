import { Client, Email } from "@/types/types";
import { schemaAddClient, schemaDeleteClient, schemaSendNewsLetter } from "./zod/schemas";
import { neon } from "@neondatabase/serverless";
import z from "zod";
import revalidatePathAction from "@/actions/revalidatePath";
import { sendEmail } from "@/actions/sendEmails";
import { JwtPayload } from "@clerk/types";

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

export async function deleteClientDB(data: z.infer<typeof schemaDeleteClient>): Promise<Client[]> {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await (sql`
        DELETE FROM clients
        WHERE id = ${data.client_id}
        RETURNING *;
    `) as Client[];

    if (result) revalidatePathAction("/client-list")
    return result;
}


export async function sendNewsLetterDb(data: z.infer<typeof schemaSendNewsLetter>, sessionClaims: JwtPayload): Promise<boolean> {
    const sql = neon(process.env.DATABASE_URL!); // Use ! for non-null assertion if you're sure it's defined
    const companyName = sessionClaims.org_name;
    const userName = sessionClaims.name;    

    const emails = await sql`
        SELECT email_address FROM clients WHERE organization_id = ${sessionClaims.orgId}
    ` as Email[]; // No quotes around ${sessionClaims.org_id}
    
    try {
        await sendEmail(String(companyName || userName || "Your LandScaper"), emails, data);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}