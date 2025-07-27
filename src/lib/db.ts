import { Account, Client, Email } from "@/types/types";
import { schemaAddClient, schemaDeleteClient, schemaSendNewsLetter, schemaUpdateCuttingDay, schemaUpdatePricePerCut } from "./zod/schemas";
import { neon } from "@neondatabase/serverless";
import z from "zod";
import revalidatePathAction from "@/actions/revalidatePath";
import { sendEmail } from "@/actions/sendEmails";
import { JwtPayload } from "@clerk/types";

//MARK: Add clients
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

//MARK: Delete clients
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

//MARK: Update price per cut
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

//MARK: Updated Client Cut Day
export async function updatedClientCutDayDb(data: z.infer<typeof schemaUpdateCuttingDay>, orgId: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const clientCheck = await sql`
        SELECT id FROM clients
        WHERE clients.id = ${data.clientId} AND clients.organization_id = ${orgId}
    `;
    if (!clientCheck || clientCheck.length === 0) {
        throw new Error("Client not found or orgId mismatch");
    }
    const result = await sql`
        INSERT INTO cutting_schedule (client_id, cutting_week, cutting_day)
        VALUES (${data.clientId}, ${data.cuttingWeek}, ${data.updatedDay})
        ON CONFLICT (client_id, cutting_week) DO UPDATE
        SET cutting_day = EXCLUDED.cutting_day
        RETURNING *
    `;
    revalidatePathAction("/client-list")
    return result;
}

//MARK: Send newsletter
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

export async function fetchClientsWithSchedules(
  orgId: string,
  pageSize: number,
  offset: number,
  searchTerm: string,
  searchTermCuttingWeek: number,
  searchTermCuttingDay: string
) {
  console.log("data: ", searchTerm, " ", searchTermCuttingWeek, ' ', searchTermCuttingDay)
  const sql = neon(`${process.env.DATABASE_URL}`);
  let query = sql`
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
        COALESCE(cs.cutting_week, 0) AS cutting_week,
        COALESCE(cs.cutting_day, 'No cut') AS cutting_day
      FROM clients_with_balance cwb
      LEFT JOIN cutting_schedule cs ON cwb.id = cs.client_id
    )
  `;

  let countQuery = sql`
    SELECT COUNT(*) AS total_count 
    FROM clients_with_schedules cws
  `;

  let selectQuery = sql`
    SELECT 
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
  `;

  if (searchTerm !== "") {
    countQuery = sql`
      ${countQuery}
      WHERE 
        cws.full_name ILIKE ${`%${searchTerm}%`} 
        OR cws.phone_number ILIKE ${`%${searchTerm}%`} 
        OR cws.email_address ILIKE ${`%${searchTerm}%`} 
        OR cws.address ILIKE ${`%${searchTerm}%`}
    `;

    selectQuery = sql`
      ${selectQuery}
      WHERE 
        cws.full_name ILIKE ${`%${searchTerm}%`} 
        OR cws.phone_number ILIKE ${`%${searchTerm}%`} 
        OR cws.email_address ILIKE ${`%${searchTerm}%`} 
        OR cws.address ILIKE ${`%${searchTerm}%`}
    `;
  }

  const countResult = await sql`
    ${query}
    ${countQuery}
  `;
  const totalCount = countResult[0].total_count;

  query = sql`
    ${query}
    SELECT 
      ${totalCount} AS total_count,
      cws.id,
      cws.full_name,
      cws.phone_number,
      cws.email_address,
      cws.address,
      cws.amount_owing,
      cws.price_per_cut,
      cws.cutting_week,
      cws.cutting_day
    FROM (${selectQuery}) AS cws
    ORDER BY cws.id
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  const result = await query;
  return result;
}