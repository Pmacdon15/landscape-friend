import { Account, Client, Email } from "@/types/types";
import { schemaAddClient, schemaDeleteClient, schemaSendNewsLetter, schemaUpdatePricePerCut } from "./zod/schemas";
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

export async function updatedClientPricePerCutDb(data: z.infer<typeof schemaUpdatePricePerCut>, orgId: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`
        UPDATE clients
        SET price_per_cut = ${data.pricePerCut}
        WHERE id = ${data.clientId} AND organization_id = ${orgId}
    `

    if (result) revalidatePathAction("/client-list")
    return result;
}
//TODO: confirm org id on delete so auth confirms users is admin and part of the same org
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

    try {
        sendEmail(senderName, emailList, data);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}




export async function fetchClientsWithSchedules(orgId: string, pageSize: number, offset: number) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`
            WITH clients_with_balance AS (
                SELECT 
                c.*,
                a.current_balance AS amount_owing
                FROM clients c
                LEFT JOIN accounts a ON c.id = a.client_id
                WHERE c.organization_id = ${orgId}
            ),
            clients_with_schedules AS (
                SELECT 
                cwb.*,
                cs.cutting_week,
                cs.cutting_day
                FROM clients_with_balance cwb
                LEFT JOIN cutting_schedule cs ON cwb.id = cs.client_id
            )
            SELECT 
                (SELECT COUNT(*) FROM clients c WHERE c.organization_id = ${orgId}) AS total_count,
                cws.id,
                cws.full_name,
                cws.phone_number,
                cws.email_address,
                cws.address,
                cws.amount_owing,
                cws.price_per_cut,
                cws.cutting_week,
                cws.cutting_day
            FROM clients_with_schedules cws
            ORDER BY cws.id
            LIMIT ${pageSize} OFFSET ${offset};
        `;
    return result;
}