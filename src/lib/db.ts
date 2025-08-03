import { Account, Address, APIKey, Client, Email, NamesAndEmails } from "@/types/types";
import { schemaAddClient, schemaDeleteClient, schemaMarkYardCut, schemaSendEmail, schemaUpdateCuttingDay, schemaUpdatePricePerCut } from "./zod/schemas";
import { neon } from "@neondatabase/serverless";
import z from "zod";
import revalidatePathAction from "@/actions/revalidatePath";
import { JwtPayload } from "@clerk/types";
import { sendGroupEmail } from "./resend";
import { auth } from "@clerk/nextjs/server";

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
export async function deleteClientDB(data: z.infer<typeof schemaDeleteClient>, organization_id: string): Promise<Client[]> {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const result = await (sql`
    WITH deleted_account AS (
      DELETE FROM accounts
      WHERE client_id = ${data.client_id} AND client_id IN (
        SELECT id FROM clients WHERE organization_id = ${organization_id}
      )
      RETURNING *
    ),
    deleted_client AS (
      DELETE FROM clients
      WHERE id = ${data.client_id} AND organization_id = ${organization_id}
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

//MARK: Fetch clients
export async function fetchClientsWithSchedules(
  orgId: string,
  pageSize: number,
  offset: number,
  searchTerm: string,
  searchTermCuttingWeek: number,
  searchTermCuttingDay: string
) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const baseQuery = sql`
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

  let selectQuery = sql`
    SELECT DISTINCT 
      cws.id
    FROM clients_with_schedules cws
  `;

  const whereClauses = [];

  if (searchTerm !== "") {
    whereClauses.push(sql`
      (cws.full_name ILIKE ${`%${searchTerm}%`} 
      OR cws.phone_number ILIKE ${`%${searchTerm}%`} 
      OR cws.email_address ILIKE ${`%${searchTerm}%`} 
      OR cws.address ILIKE ${`%${searchTerm}%`})
    `);
  }

  if (searchTermCuttingWeek > 0 && searchTermCuttingDay !== "") {
    whereClauses.push(sql`
      cws.cutting_week = ${searchTermCuttingWeek} 
      AND cws.cutting_day = ${searchTermCuttingDay}
    `);
  } else if (searchTermCuttingWeek > 0) {
    whereClauses.push(sql`
      cws.cutting_week = ${searchTermCuttingWeek} 
      AND cws.cutting_day != 'No cut'
    `);
  } else if (searchTermCuttingDay !== "") {
    whereClauses.push(sql`
      cws.cutting_day = ${searchTermCuttingDay}
    `);
  }

  if (whereClauses.length > 0) {
    let whereClause = sql`WHERE ${whereClauses[0]}`;
    if (whereClauses.length > 1) {
      whereClause = sql`${whereClause} AND ${whereClauses[1]}`;
    }

    selectQuery = sql`
      ${selectQuery}
      ${whereClause}
    `;
  }

  const countQuery = sql`
    ${baseQuery}
    SELECT COUNT(*) AS total_count
    FROM (${selectQuery}) AS client_ids
  `;

  const countResult = await countQuery;
  const totalCount = countResult[0]?.total_count || 0;

  const paginatedClientIdsQuery = sql`
    ${baseQuery}
    SELECT id
    FROM (${selectQuery}) AS client_ids
    ORDER BY id
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  const paginatedClientIdsResult = await paginatedClientIdsQuery;
  const paginatedClientIds = paginatedClientIdsResult.map(row => row.id);

  const clientsQuery = sql`
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
      WHERE cwb.id = ANY(${paginatedClientIds})
    )
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
    ORDER BY cws.id
  `;

  const clientsResult = await clientsQuery;

  return { clientsResult, totalCount };
}

//MARK:Fetch uncut addresses
export async function FetchAllUnCutAddressesDB(organizationId: string, searchTermCuttingDate: Date): Promise<Address[]> {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const result = await sql`
    SELECT c.address
    FROM clients c
    JOIN cutting_schedule cs ON c.id = cs.client_id
    WHERE c.organization_id = ${organizationId}
    AND c.id NOT IN (
      SELECT ymc.client_id
      FROM yards_marked_cut ymc
      WHERE ymc.cutting_date = ${searchTermCuttingDate}
    );
  `;
  return result.map(item => ({ address: item.address }));
}
//MARK: Fetch cutting day
export async function fetchClientsCuttingSchedules(
  orgId: string,
  pageSize: number,
  offset: number,
  searchTerm: string,
  cuttingDate: Date,
  searchTermIsCut: boolean
) {
  const startOfYear = new Date(cuttingDate.getFullYear(), 0, 1);
  const daysSinceStart = Math.floor(
    (cuttingDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  const cuttingWeek = Math.floor((daysSinceStart % 28) / 7) + 1;
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const cuttingDay = daysOfWeek[cuttingDate.getDay()];

  const sql = neon(`${process.env.DATABASE_URL}`);

  const query = sql`
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
      JOIN cutting_schedule cs ON cwb.id = cs.client_id
      WHERE cs.cutting_week = ${cuttingWeek} AND cs.cutting_day = ${cuttingDay}
    ),
    clients_marked_cut AS (
      SELECT
        ymc.client_id,
        ymc.cutting_date
      FROM yards_marked_cut ymc
      WHERE ymc.cutting_date = ${cuttingDate}
    )
  `;

  let countQuery = sql`
  SELECT COUNT(DISTINCT cws.id) AS total_count
  FROM clients_with_schedules cws
  LEFT JOIN clients_marked_cut cmc ON cws.id = cmc.client_id
  WHERE ${searchTermIsCut ? sql`cmc.client_id IS NOT NULL` : sql`cmc.client_id IS NULL`}
`;

  let selectQuery = sql`
  SELECT DISTINCT
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
  LEFT JOIN clients_marked_cut cmc ON cws.id = cmc.client_id
  WHERE ${searchTermIsCut ? sql`cmc.client_id IS NOT NULL` : sql`cmc.client_id IS NULL`}
`;

  const whereClauses = [];

  if (searchTerm !== "") {
    whereClauses.push(sql`
      (cws.full_name ILIKE ${`%${searchTerm}%`}
      OR cws.phone_number ILIKE ${`%${searchTerm}%`}
      OR cws.email_address ILIKE ${`%${searchTerm}%`}
      OR cws.address ILIKE ${`%${searchTerm}%`})
    `);
  }

  if (whereClauses.length > 0) {
    let whereClause = sql`AND ${whereClauses[0]}`;
    if (whereClauses.length > 1) {
      whereClause = sql`${whereClause} AND ${whereClauses[1]}`;
    }

    countQuery = sql`
      ${countQuery}
      ${whereClause}
    `;

    selectQuery = sql`
      ${selectQuery}
      ${whereClause}
    `;
  }

  const finalQuery = sql`
    ${query}
    ${selectQuery}
    ORDER BY cws.id
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  const finalCountQuery = sql`${query} ${countQuery}`;

  const [clientsResult, totalCountResult] = await Promise.all([
    finalQuery,
    finalCountQuery
  ]);

  const totalCount = totalCountResult[0]?.total_count || 0;

  return { clientsResult, totalCount };
}

//MARK: Mark yard cut
export async function markYardCutDb(data: z.infer<typeof schemaMarkYardCut>, organization_id: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const result = await sql`
    INSERT INTO yards_marked_cut (client_id, cutting_date)
    SELECT ${data.clientId}, ${data.date}
    FROM clients
    WHERE id = ${data.clientId} AND organization_id = ${organization_id}
    ON CONFLICT (client_id, cutting_date) DO NOTHING
    RETURNING *;
  `;

  if (!result || result.length === 0) {
    throw new Error('Client not found, access denied, or already marked as cut');
  }

  revalidatePathAction("/cutting-list")
  return result;
}

//MARK: Send newsletter
export async function sendNewsLetterDb(data: z.infer<typeof schemaSendEmail>, sessionClaims: JwtPayload, userId: string): Promise<boolean> {
  const sql = neon(process.env.DATABASE_URL!);
  const baseName = String(sessionClaims.orgName || sessionClaims.userFullName || "Your-LandScaper");
  const companyName = baseName.replace(/\s+/g, '-');

  const emails = await sql`
        SELECT email_address FROM clients WHERE organization_id = ${sessionClaims.orgId || userId}
    ` as Email[];

  const emailList = emails.map(email => email.email_address);

  try {
    sendGroupEmail(companyName, emailList, data);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

//MARK: Fetch names and emails
export async function fetchClientNamesAndEmailsDb(orgId: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const namesAndEmails = await (sql`
    SELECT 
      full_name,
      email_address
    FROM clients 
    WHERE organization_id = ${orgId}
  `) as NamesAndEmails[]
  return namesAndEmails
}

//MARK:fetch Strip API Key
export async function fetchStripAPIKeyDb(orgId: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await (sql`
    SELECT 
      api_key
    FROM strip_api_keys 
    WHERE organization_id = ${orgId}
  `) as { api_key: string }[];
  return result[0];
}
