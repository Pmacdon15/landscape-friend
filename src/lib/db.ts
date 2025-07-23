import { Account, Client, Email } from "@/types/types";
import { schemaAddClient, schemaDeleteClient, schemaSendNewsLetter } from "./zod/schemas";
import { neon } from "@neondatabase/serverless";
import z from "zod";
import revalidatePathAction from "@/actions/revalidatePath";
import { sendEmail } from "@/actions/sendEmails";
import { JwtPayload } from "@clerk/types";

export async function addClientDB(data: z.infer<typeof schemaAddClient>, organization_id: string): Promise<{ client: Client; account: Account }[]> {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await (sql`
        WITH new_client AS (
            INSERT INTO clients (full_name, phone_number, email_address, organization_id, address)
            VALUES (${data.full_name}, ${data.phone_number}, ${data.email_address}, ${organization_id}, ${data.address})
            RETURNING *
        ),
        new_account AS (
            INSERT INTO accounts (client_id)
            SELECT id
            FROM new_client
            RETURNING *
        )
        SELECT 
            (SELECT row_to_json(new_client.*)::jsonb AS client FROM new_client),
            (SELECT row_to_json(new_account.*)::jsonb AS account FROM new_account);
    `) as { client: Client; account: Account }[];

    if (result) revalidatePathAction("/client-list")
    return result;
}

export async function deleteClientDB(data: z.infer<typeof schemaDeleteClient>): Promise<Client[]> {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await (sql`
        WITH deleted_account AS (
            DELETE FROM accounts
            WHERE client_id = ${data.client_id}
            RETURNING *
        ),
        deleted_client AS (
            DELETE FROM clients
            WHERE id = ${data.client_id}
            RETURNING *
        )
        SELECT * FROM deleted_client;
    `) as Client[];

    if (result) revalidatePathAction("/client-list")
    return result;
}

export async function sendNewsLetterDb(data: z.infer<typeof schemaSendNewsLetter>, sessionClaims: JwtPayload, userId: string): Promise<boolean> {
    const sql = neon(process.env.DATABASE_URL!);
    const baseName = String(sessionClaims.orgName || sessionClaims.name || "Your-LandScaper");
    const senderName = baseName.replace(/\s+/g, '-');

    const emails = await sql`
        SELECT email_address FROM clients WHERE organization_id = ${sessionClaims.orgId || userId}
    ` as Email[];

    const emailList = emails.map(email => email.email_address);

    console.log("Emails:", emailList)

    try {
        sendEmail(senderName, emailList, data);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}