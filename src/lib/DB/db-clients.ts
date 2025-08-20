import { schemaAddClient, schemaAssignSnowClearing, schemaDeleteClient, schemaDeleteSiteMap, schemaMarkYardCut, schemaToggleSnowClient, schemaUpdateCuttingDay, schemaUpdatePricePerCut } from "@/lib/zod/schemas";
import { neon } from "@neondatabase/serverless";
import z from "zod";
import { Account, Client } from "@/types/types-clients";

//MARK: Add clients


export async function addClientDB(data: z.infer<typeof schemaAddClient>, organization_id: string): Promise<{ client: Client; account: Account }[]> {
  console.log("addClientDB called with data:", data, "and organization_id:", organization_id);
  const sql = neon(`${process.env.DATABASE_URL}`);
  try {
    const result = await (sql`
        WITH new_client AS (
            INSERT INTO clients (full_name, phone_number, email_address, organization_id, address, stripe_customer_id)
            VALUES (${data.full_name}, ${data.phone_number}, ${data.email_address}, ${organization_id}, ${data.address}, ${data.stripe_customer_id || null})
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
    console.log("addClientDB result:", result);
    return result;
  } catch (error) {
    console.error("Error in addClientDB SQL query:", error);
    throw error;
  }
}

export async function updateClientStripeCustomerIdDb(email_address: string, stripe_customer_id: string, organization_id: string) {
  console.log("updateClientStripeCustomerIdDb called with:", { email_address, stripe_customer_id, organization_id });
  const sql = neon(`${process.env.DATABASE_URL}`);
  try {
    const result = await sql`
    UPDATE clients
    SET stripe_customer_id = ${stripe_customer_id}
    WHERE email_address = ${email_address} AND organization_id = ${organization_id}
    RETURNING *;
  `;
    console.log("updateClientStripeCustomerIdDb result:", result);
    return result;
  } catch (error) {
    console.error("Error in updateClientStripeCustomerIdDb SQL query:", error);
    throw error;
  }
}

//MARK: Count clients by org id
export async function countClientsByOrgId(organization_id: string): Promise<number> {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const result = await sql`
    SELECT COUNT(*) as count FROM clients WHERE organization_id = ${organization_id}
  `;
  return Number(result[0].count);
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

  return result;
}


export async function deleteSiteMapDB(data: z.infer<typeof schemaDeleteSiteMap>, organization_id: string): Promise<{ success: boolean }> {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const result = await sql`
    DELETE FROM images
    WHERE
      id = ${data.siteMap_id} AND
      "customerID" = ${data.client_id}::text AND
      EXISTS (
        SELECT 1
        FROM clients
        WHERE
          clients.id = ${data.client_id} AND
          clients.organization_id = ${organization_id}
      )
  `;
    
  return { success: result.length > 0 };
}

//MARK: Update price per cut
export async function updateClientPricePerDb(data: z.infer<typeof schemaUpdatePricePerCut>, orgId: string) {
  const sql = neon(`${ process.env.DATABASE_URL }`);

  let setClause;
  if (data.snow) {
    setClause = sql`price_per_month_snow = ${ data.pricePerCut } `;
  } else {
    setClause = sql`price_per_cut = ${ data.pricePerCut } `;
  }

  const result = await sql`
        UPDATE clients
        SET ${ setClause }
        WHERE id = ${ data.clientId } AND organization_id = ${ orgId }
  `
  return result;
}

//MARK: Updated Client Cut Day
export async function updatedClientCutDayDb(data: z.infer<typeof schemaUpdateCuttingDay>, orgId: string) {
  const sql = neon(`${ process.env.DATABASE_URL } `);
  const clientCheck = await sql`
        SELECT id FROM clients
        WHERE clients.id = ${ data.clientId } AND clients.organization_id = ${ orgId }
  `;
  if (!clientCheck || clientCheck.length === 0) {
    throw new Error("Client not found or orgId mismatch");
  }
  const result = await sql`
        INSERT INTO cutting_schedule(client_id, cutting_week, cutting_day)
  VALUES(${ data.clientId }, ${ data.cuttingWeek }, ${ data.updatedDay })
        ON CONFLICT(client_id, cutting_week) DO UPDATE
        SET cutting_day = EXCLUDED.cutting_day
  RETURNING *
    `;
  return result;
}

//MARK: Fetch clients snow clearing
export async function fetchClientsClearingGroupsDb(
  orgId: string,
  pageSize: number,
  offset: number,
  searchTerm: string,
  clearingDate: Date,
  searchTermIsServiced: boolean,
  searchTermAssignedTo: string
) {
  const sql = neon(`${ process.env.DATABASE_URL } `);

  const baseQuery = sql`
    WITH clients_with_balance AS(
      SELECT 
        c.*,
      a.current_balance AS amount_owing
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      WHERE c.organization_id = ${ orgId } AND c.snow_client = true
    ),
    cleared_yards AS(
      SELECT client_id
      FROM yards_marked_clear
      WHERE clearing_date = ${ clearingDate }
    ),
      clients_with_assignments AS(
        SELECT 
        cwb.*,
        sca.assigned_to
      FROM clients_with_balance cwb
      LEFT JOIN snow_clearing_assignments sca ON cwb.id = sca.client_id
      )
        `;

  let selectQuery = sql`
    SELECT DISTINCT
  cwa.id
    FROM clients_with_assignments cwa
    LEFT JOIN cleared_yards cy ON cwa.id = cy.client_id
    WHERE ${ searchTermIsServiced ? sql`cy.client_id IS NOT NULL` : sql`cy.client_id IS NULL` }
  `;

  const whereClauses = [];

  if (searchTerm !== "") {
    whereClauses.push(sql`
    (cwa.full_name ILIKE ${`%${searchTerm}%`} 
      OR cwa.phone_number ILIKE ${ `%${searchTerm}%` } 
      OR cwa.email_address ILIKE ${ `%${searchTerm}%` } 
      OR cwa.address ILIKE ${ `%${searchTerm}%` })
`);
  }

  if (searchTermAssignedTo !== "") {
    whereClauses.push(sql`
cwa.assigned_to = ${ searchTermAssignedTo }
`);
  } else {
    whereClauses.push(sql`
cwa.assigned_to IS NULL
    `);
  }

  if (whereClauses.length > 0) {
    let whereClause = sql`AND ${ whereClauses[0] } `;
    for (let i = 1; i < whereClauses.length; i++) {
      whereClause = sql`${ whereClause } AND ${ whereClauses[i] } `;
    }

    selectQuery = sql`
      ${ selectQuery }
      ${ whereClause }
`;
  }

  const countQuery = sql`
    ${ baseQuery }
    SELECT COUNT(*) AS total_count
FROM(${ selectQuery }) AS client_ids
  `;

  const countResult = await countQuery;
  const totalCount = countResult[0]?.total_count || 0;

  const paginatedClientIdsQuery = sql`
    ${ baseQuery }
    SELECT id
FROM(${ selectQuery }) AS client_ids
    ORDER BY id
    LIMIT ${ pageSize } OFFSET ${ offset }
`;

  const paginatedClientIdsResult = await paginatedClientIdsQuery;
  const paginatedClientIds = paginatedClientIdsResult.map(row => row.id);

  const clientsQuery = sql`
    WITH clients_with_balance AS(
  SELECT 
        c.*,
  a.current_balance AS amount_owing
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      WHERE c.organization_id = ${ orgId } AND c.id = ANY(${ paginatedClientIds })
),
  clients_with_assignments AS(
    SELECT 
        cwb.*,
    sca.assigned_to
      FROM clients_with_balance cwb
      LEFT JOIN snow_clearing_assignments sca ON cwb.id = sca.client_id
  )
SELECT
cwa.id,
  cwa.full_name,
  cwa.phone_number,
  cwa.email_address,
  cwa.address,
  COALESCE(img.urls, ARRAY[]:: TEXT[]) AS images
    FROM clients_with_assignments cwa
    LEFT JOIN LATERAL(
    SELECT ARRAY_AGG(i.imageURL) as urls
      FROM images i
      WHERE i.customerID = cwa.id:: TEXT
  ) img ON TRUE
    ORDER BY cwa.id
  `;

  const clientsResult = await clientsQuery;

  return { clientsResult, totalCount };
}

//MARK: Fetch clients cutting
export async function fetchClientsWithSchedules(
  orgId: string,
  pageSize: number,
  offset: number,
  searchTerm: string,
  searchTermCuttingWeek: number,
  searchTermCuttingDay: string
) {
  const sql = neon(`${ process.env.DATABASE_URL } `);

  const baseQuery = sql`
    WITH clients_with_balance AS(
    SELECT 
        c.*,
    a.current_balance AS amount_owing
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      WHERE c.organization_id = ${ orgId }
  ),
  clients_with_schedules AS(
    SELECT 
        cwb.*,
    COALESCE(cs.cutting_week, 0) AS cutting_week,
    COALESCE(cs.cutting_day, 'No cut') AS cutting_day,
    sca.assigned_to
      FROM clients_with_balance cwb
      LEFT JOIN cutting_schedule cs ON cwb.id = cs.client_id
      LEFT JOIN snow_clearing_assignments sca ON cwb.id = sca.client_id
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
cws.cutting_week = ${ searchTermCuttingWeek } 
      AND cws.cutting_day = ${ searchTermCuttingDay }
`);
  } else if (searchTermCuttingWeek > 0) {
    whereClauses.push(sql`
cws.cutting_week = ${ searchTermCuttingWeek }
`);
  } else if (searchTermCuttingDay !== "") {
    whereClauses.push(sql`
cws.cutting_day = ${ searchTermCuttingDay }
`);
  }

  if (whereClauses.length > 0) {
    let whereClause = sql`WHERE ${ whereClauses[0] } `;
    if (whereClauses.length > 1) {
      whereClause = sql`${ whereClause } AND ${ whereClauses[1] } `;
    }

    selectQuery = sql`
      ${ selectQuery }
      ${ whereClause }
`;
  }

  const countQuery = sql`
    ${ baseQuery }
    SELECT COUNT(*) AS total_count
FROM(${ selectQuery }) AS client_ids
  `;

  const countResult = await countQuery;
  const totalCount = countResult[0]?.total_count || 0;

  const paginatedClientIdsQuery = sql`
    ${ baseQuery }
    SELECT id
FROM(${ selectQuery }) AS client_ids
    ORDER BY id
    LIMIT ${ pageSize } OFFSET ${ offset }
`;

  const paginatedClientIdsResult = await paginatedClientIdsQuery;
  const paginatedClientIds = paginatedClientIdsResult.map(row => row.id);

  const clientsQuery = sql`
    WITH clients_with_balance AS(
  SELECT 
        c.*,
  a.current_balance AS amount_owing
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      WHERE c.organization_id = ${ orgId }
),
  clients_with_schedules AS(
    SELECT 
        cwb.*,
    COALESCE(cs.cutting_week, 0) AS cutting_week,
    COALESCE(cs.cutting_day, 'No cut') AS cutting_day,
    sca.assigned_to
      FROM clients_with_balance cwb
      LEFT JOIN cutting_schedule cs ON cwb.id = cs.client_id
      LEFT JOIN snow_clearing_assignments sca ON cwb.id = sca.client_id
      WHERE cwb.id = ANY(${ paginatedClientIds })
  )
SELECT
cws.id,
  cws.full_name,
  cws.phone_number,
  cws.email_address,
  cws.address,
  cws.amount_owing,
  cws.price_per_cut,
  cws.price_per_month_snow,
  cws.snow_client,
  cws.cutting_week,
  cws.cutting_day,
  cws.assigned_to,
  COALESCE(img.urls, ARRAY[]:: TEXT[]) AS images
    FROM clients_with_schedules cws
    LEFT JOIN LATERAL(
    SELECT ARRAY_AGG(i.imageURL) as urls
      FROM images i
      WHERE i.customerID = cws.id:: TEXT
  ) img ON TRUE
    ORDER BY cws.id
  `;

  const clientsResult = await clientsQuery;

  return { clientsResult, totalCount };
}

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

  const sql = neon(`${ process.env.DATABASE_URL } `);

  const query = sql`
    WITH clients_with_balance AS(
    SELECT
        c.*,
    a.current_balance AS amount_owing
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      WHERE c.organization_id = ${ orgId }
  ),
  clients_with_schedules AS(
    SELECT
        cwb.*,
    cs.cutting_week,
    cs.cutting_day
      FROM clients_with_balance cwb
      JOIN cutting_schedule cs ON cwb.id = cs.client_id
      WHERE cs.cutting_week = ${ cuttingWeek } AND cs.cutting_day = ${ cuttingDay }
  ),
    clients_marked_cut AS(
      SELECT
        ymc.client_id,
      ymc.cutting_date
      FROM yards_marked_cut ymc
      WHERE ymc.cutting_date = ${ cuttingDate }
    ),
      snow_assignments AS(
        SELECT
        sca.client_id,
        sca.assigned_to
      FROM snow_clearing_assignments sca
      WHERE sca.organization_id = ${ orgId }
      )
        `;

  let countQuery = sql`
  SELECT COUNT(DISTINCT cws.id) AS total_count
  FROM clients_with_schedules cws
  LEFT JOIN clients_marked_cut cmc ON cws.id = cmc.client_id
  LEFT JOIN snow_assignments sa ON cws.id = sa.client_id
  WHERE ${ searchTermIsCut ? sql`cmc.client_id IS NOT NULL` : sql`cmc.client_id IS NULL` }
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
  cws.price_per_month_snow,
  cws.snow_client,
  cws.cutting_week,
  cws.cutting_day,
  sa.assigned_to,
  COALESCE(img.urls, ARRAY[]:: TEXT[]) AS images
  FROM clients_with_schedules cws
  LEFT JOIN clients_marked_cut cmc ON cws.id = cmc.client_id
  LEFT JOIN snow_assignments sa ON cws.id = sa.client_id
  LEFT JOIN LATERAL(
    SELECT ARRAY_AGG(i.imageURL) as urls
    FROM images i
    WHERE i.customerID = cws.id:: TEXT
  ) img ON TRUE
  WHERE ${ searchTermIsCut ? sql`cmc.client_id IS NOT NULL` : sql`cmc.client_id IS NULL` }
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
    let whereClause = sql`AND ${ whereClauses[0] } `;
    if (whereClauses.length > 1) {
      whereClause = sql`${ whereClause } AND ${ whereClauses[1] } `;
    }

    countQuery = sql`
      ${ countQuery }
      ${ whereClause }
`;

    selectQuery = sql`
      ${ selectQuery }
      ${ whereClause }
`;
  }

  const finalQuery = sql`
    ${ query }
    ${ selectQuery }
    ORDER BY cws.id
    LIMIT ${ pageSize } OFFSET ${ offset }
`;

  const finalCountQuery = sql`${ query } ${ countQuery } `;

  const [clientsResult, totalCountResult] = await Promise.all([
    finalQuery,
    finalCountQuery
  ]);

  const totalCount = totalCountResult[0]?.total_count || 0;

  return { clientsResult, totalCount };
}

//MARK: Mark yard cut
export async function markYardServicedDb(data: z.infer<typeof schemaMarkYardCut>, organization_id: string, snow: boolean) {
  const sql = neon(`${ process.env.DATABASE_URL } `);

  const query = snow
    ? sql`
        INSERT INTO yards_marked_clear(client_id, clearing_date)
        SELECT ${ data.clientId }, ${ data.date }
        FROM clients
        WHERE id = ${ data.clientId } AND organization_id = ${ organization_id }
        ON CONFLICT(client_id, clearing_date) DO NOTHING
RETURNING *;
`
    : sql`
        INSERT INTO yards_marked_cut(client_id, cutting_date)
        SELECT ${ data.clientId }, ${ data.date }
        FROM clients
        WHERE id = ${ data.clientId } AND organization_id = ${ organization_id }
        ON CONFLICT(client_id, cutting_date) DO NOTHING
RETURNING *;
`;

  const result = await query;

  if (!result || result.length === 0) {
    throw new Error('Client not found, access denied, or already marked as serviced');
  }

  return result;
}

//MARK: Toggle snow client
export async function toggleSnowClientDb(data: z.infer<typeof schemaToggleSnowClient>, organization_id: string) {
  const sql = neon(`${ process.env.DATABASE_URL } `);

  const result = await sql`
    UPDATE clients 
    SET snow_client = NOT snow_client 
    WHERE id = ${ data.clientId } AND organization_id = ${ organization_id }
RETURNING *;
`;

  if (!result || result.length === 0) {
    throw new Error('Toggle Failed');
  }

  return result;
}

//MARK: Toggle snow client
export async function assignSnowClearingDb(data: z.infer<typeof schemaAssignSnowClearing>, organization_id: string) {
  const sql = neon(`${ process.env.DATABASE_URL } `);

  const result = await sql`
    INSERT INTO snow_clearing_assignments(client_id, assigned_to, organization_id)
    SELECT ${ data.clientId }, ${ data.assignedTo }, ${ organization_id }
    FROM clients
    WHERE id = ${ data.clientId } AND organization_id = ${ organization_id }
    ON CONFLICT(client_id) DO UPDATE
    SET assigned_to = EXCLUDED.assigned_to
RETURNING *;
`;

  if (!result || result.length === 0) {
    throw new Error('Assignment Failed');
  }

  return result;
}


//MARK: Mark Payment
export async function markPaidDb(invoiceId: string, customerEmail: string, amountPaid: number, organizationId: string) {
  const sql = neon(`${ process.env.DATABASE_URL } `);
  try {
    const result = await sql`
      WITH client_info AS(
  SELECT id AS client_id
          FROM clients
          WHERE email_address = ${ customerEmail } AND organization_id = ${ organizationId }
),
  inserted_payment AS(
    INSERT INTO payments(account_id, amount, organization_id)
          SELECT a.id, ${ amountPaid }, ${ organizationId }
          FROM accounts a
          JOIN client_info ci ON a.client_id = ci.client_id
          RETURNING payments.id-- Return something to indicate success
  )
      UPDATE accounts
      SET current_balance = current_balance - ${ amountPaid }
      FROM client_info ci
      WHERE accounts.client_id = ci.client_id
      RETURNING accounts.current_balance AS new_balance, (SELECT id FROM inserted_payment) AS payment_id;
`;

    if (!result || result.length === 0) {
      throw new Error(`Failed to mark invoice ${ invoiceId } as paid in DB.Client not found or update failed.`);
    }

    const { new_balance, payment_id } = result[0];
    console.log(`Invoice ${ invoiceId } marked paid.New balance: ${ new_balance }, Payment ID: ${ payment_id } `);

    return { success: true, message: `Invoice ${ invoiceId } marked as paid and database updated.`, newBalance: new_balance, paymentId: payment_id };

  } catch (e) {
    console.error('Error marking invoice paid in DB:', e);
    return { success: false, message: e instanceof Error ? e.message : 'Failed to mark invoice paid in DB' };
  }
}

