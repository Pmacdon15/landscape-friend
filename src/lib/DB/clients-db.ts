import { neon, type SQL } from '@neondatabase/serverless'
import type z from 'zod'
import type {
	schemaAddClient,
	schemaAssign,
	schemaAssignSnow,
	schemaDeleteClient,
	schemaDeleteSiteMap,
	schemaMarkYardCut,
	schemaUpdateCuttingDay,
	schemaUpdatePricePerMonth,
} from '@/lib/zod/schemas'
import type { BlobUrl } from '@/types/blob-types'
import type {
	Account,
	Client,
	ClientInfoList,
	CustomerName,
} from '@/types/clients-types'
import type { NovuSubscriberIds } from '@/types/novu-types'

//MARK: Add clients

export async function addClientDB(
	data: z.infer<typeof schemaAddClient>,
	organization_id: string,
): Promise<{ client: Client; account: Account }[]> {
	// console.log("addClientDB called with data:", data, "and organization_id:", organization_id);
	const sql = neon(`${process.env.DATABASE_URL}`)
	try {
		const result = (await sql`
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
    `) as { client: Client; account: Account }[]
		// console.log("addClientDB result:", result);
		return result
	} catch (error) {
		console.error('Error in addClientDB SQL query:', error)
		throw error
	}
}
//MARK:Fetch novu id
export async function getNovuIds(
	userIds: string[],
): Promise<NovuSubscriberIds> {
	const sql = neon(String(process.env.DATABASE_URL))
	try {
		const result = await sql.query(
			'SELECT id, novu_subscriber_id FROM users WHERE id = ANY($1)',
			[userIds],
		)
		const novuIds: { [key: string]: string | null } = {}
		result.forEach((row) => {
			novuIds[row.id] = row.novu_subscriber_id
		})
		return novuIds
	} catch (error) {
		console.error(error)
		return {}
	}
}
//MARK: Fetch Customer names from stripe id
export async function fetchStripeCustomerNamesDB(
	organization_id: string,
	stripeCusomterIdList: string[],
): Promise<CustomerName[]> {
	const sql = neon(`${process.env.DATABASE_URL}`)
	const result = (await sql`
    SELECT
      full_name,
      stripe_customer_id
    FROM clients
    WHERE organization_id = ${organization_id} AND stripe_customer_id = ANY(${stripeCusomterIdList})
  `) as CustomerName[]
	return result
}

//MARK: Fetch Client ID by Stripe Customer ID
export async function fetchClientIdByStripeCustomerId(
	stripeCustomerId: string,
	organizationId: string,
): Promise<number | null> {
	const sql = neon(`${process.env.DATABASE_URL}`)
	try {
		const result = (await sql`
      SELECT id
      FROM clients
      WHERE stripe_customer_id = ${stripeCustomerId} AND organization_id = ${organizationId}
    `) as { id: number }[]
		return result.length > 0 ? result[0].id : null
	} catch (error) {
		console.error('Error fetching client ID by Stripe Customer ID:', error)
		return null
	}
}
export async function updateClientStripeCustomerIdDb(
	email_address: string,
	stripe_customer_id: string,
	organization_id: string,
) {
	// console.log("updateClientStripeCustomerIdDb called with:", { email_address, stripe_customer_id, organization_id });
	const sql = neon(`${process.env.DATABASE_URL}`)
	try {
		const result = await sql`
    UPDATE clients
    SET stripe_customer_id = ${stripe_customer_id}
    WHERE email_address = ${email_address} AND organization_id = ${organization_id}
    RETURNING *;
  `
		// console.log("updateClientStripeCustomerIdDb result:", result);
		return result
	} catch (error) {
		console.error(
			'Error in updateClientStripeCustomerIdDb SQL query:',
			error,
		)
		throw error
	}
}

//MARK: Count clients by org id
export async function countClientsByOrgId(
	organization_id: string,
): Promise<number> {
	const sql = neon(`${process.env.DATABASE_URL}`)
	const result = await sql`
    SELECT COUNT(*) as count FROM clients WHERE organization_id = ${organization_id}
  `
	return Number(result[0].count)
}

//MARK: Delete clients
export async function deleteClientDB(
	data: z.infer<typeof schemaDeleteClient>,
	organization_id: string,
): Promise<Client[]> {
	const sql = neon(`${process.env.DATABASE_URL}`)

	const result = (await sql`
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
  `) as Client[]

	return result
}

export async function deleteSiteMapDB(
	data: z.infer<typeof schemaDeleteSiteMap>,
	organization_id: string,
): Promise<{ success: boolean }> {
	// console.log("deleteSiteMapDB called with data:", data, "and organization_id:", organization_id);
	const sql = neon(`${process.env.DATABASE_URL}`)
	try {
		const result = await sql`
    DELETE FROM images
    WHERE
      id = ${data.siteMap_id} AND
            customerid = ${data.client_id} AND
      EXISTS (
        SELECT 1
        FROM clients
        WHERE
          clients.id = ${data.client_id} AND
          clients.organization_id = ${organization_id}
      )
  RETURNING id;
  `
		// console.log("deleteSiteMapDB SQL result:", result);
		return { success: result.length > 0 }
	} catch (error) {
		console.error('Error in deleteSiteMapDB SQL query:', error)
		throw error
	}
}

//MARK: Update price per cut
export async function updateClientPricePerDb(
	data: z.infer<typeof schemaUpdatePricePerMonth>,
	orgId: string,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	let setClause: SQL
	if (data.snow) {
		setClause = sql`price_per_month_snow = ${data.pricePerMonthSnow} `
	} else {
		setClause = sql`price_per_month_grass = ${data.pricePerMonthGrass} `
	}

	const result = await sql`
        UPDATE clients
        SET ${setClause}
        WHERE id = ${data.clientId} AND organization_id = ${orgId}
  `
	return result
}

//MARK: Updated Client Cut Day
export async function updatedClientCutDayDb(
	data: z.infer<typeof schemaUpdateCuttingDay>,
	orgId: string,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)
	// const clientCheck = await sql`
	//       SELECT id FROM clients
	//       WHERE clients.id = ${data.clientId} AND clients.organization_id = ${orgId}
	// `;
	// if (!clientCheck || clientCheck.length === 0) {
	//   throw new Error("Client not found or orgId mismatch");
	// }
	const result = await sql`
        INSERT INTO cutting_schedule(client_id, cutting_week, cutting_day, organization_id)
  VALUES(${data.clientId}, ${data.cuttingWeek}, ${data.updatedDay}, ${orgId})
        ON CONFLICT(client_id, cutting_week, organization_id) DO UPDATE
        SET cutting_day = EXCLUDED.cutting_day, cutting_week = EXCLUDED.cutting_week
  RETURNING *
    `
	return result
}
//MARK: Fetch client list
// MARK: Fetch client list
export async function fetchClientListDb(
	orgId: string,
): Promise<ClientInfoList[]> {
	const sql = neon(`${process.env.DATABASE_URL}`)
	const result = await sql`
    SELECT
      id,
      full_name,
      phone_number,
      email_address,
      address
    FROM clients
    WHERE organization_id = ${orgId};
  `
	return result as ClientInfoList[]
}

//MARK: Fetch clients snow clearing
export async function fetchClientsClearingGroupsDb(
	orgId: string,
	pageSize: number,
	offset: number,
	searchTerm: string,
	clearingDate: Date,
	searchTermIsServiced: boolean,
	searchTermAssignedTo: string,
	userId: string | null,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)

	const baseQuery = sql`
    WITH clients_with_balance AS(
      SELECT 
        c.*,
      a.current_balance AS amount_owing
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      WHERE c.organization_id = ${orgId}
    ),
    cleared_yards AS(
      SELECT client_id
      FROM yards_marked_clear
      WHERE clearing_date = ${clearingDate}
    ),
      clients_with_assignments AS(
        SELECT 
        cwb.*,
        sca.user_id as assigned_to
      FROM clients_with_balance cwb
      INNER JOIN assignments sca ON cwb.id = sca.client_id AND sca.service_type = 'snow'
      )
        `

	let selectQuery = sql`
    SELECT DISTINCT
  cwa.id
    FROM clients_with_assignments cwa
    LEFT JOIN cleared_yards cy ON cwa.id = cy.client_id
    WHERE ${searchTermIsServiced ? sql`cy.client_id IS NOT NULL` : sql`cy.client_id IS NULL`}
  `

	const whereClauses = []

	if (searchTerm !== '') {
		whereClauses.push(sql`
    (cwa.full_name ILIKE ${`%${searchTerm}%`} 
      OR cwa.phone_number ILIKE ${`%${searchTerm}%`} 
      OR cwa.email_address ILIKE ${`%${searchTerm}%`} 
      OR cwa.address ILIKE ${`%${searchTerm}%`})
`)
	}

	if (searchTermAssignedTo !== '') {
		whereClauses.push(sql`
cwa.assigned_to = ${searchTermAssignedTo}
`)
	} else {
		whereClauses.push(sql`
cwa.assigned_to = ${userId}
    `)
	}

	if (whereClauses.length > 0) {
		let whereClause = sql`AND ${whereClauses[0]} `
		for (let i = 1; i < whereClauses.length; i++) {
			whereClause = sql`${whereClause} AND ${whereClauses[i]} `
		}

		selectQuery = sql`
      ${selectQuery}
      ${whereClause}
`
	}

	const countQuery = sql`
    ${baseQuery}
    SELECT COUNT(*) AS total_count
FROM(${selectQuery}) AS client_ids
  `

	const countResult = await countQuery
	const totalCount = countResult[0]?.total_count || 0

	const paginatedClientIdsQuery = sql`
    ${baseQuery}
    SELECT id
FROM(${selectQuery}) AS client_ids
    ORDER BY id
    LIMIT ${pageSize} OFFSET ${offset}
`

	const paginatedClientIdsResult = await paginatedClientIdsQuery
	const paginatedClientIds = paginatedClientIdsResult.map((row) => row.id)

	const clientsQuery = sql`
    WITH clients_with_balance AS(
  SELECT 
        c.*,
  a.current_balance AS amount_owing
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      WHERE c.organization_id = ${orgId} AND c.id = ANY(${paginatedClientIds})
),
  clients_with_assignments AS(
    SELECT 
        cwb.*,
    sca.user_id as assigned_to
      FROM clients_with_balance cwb
      LEFT JOIN assignments sca ON cwb.id = sca.client_id AND sca.service_type = 'snow'
  )
SELECT
cwa.id,
  cwa.full_name,
  cwa.phone_number,
  cwa.email_address,
  cwa.address,
  COALESCE(img.urls, CAST('[]' AS JSONB)) AS images
    FROM clients_with_assignments cwa
    LEFT JOIN LATERAL(
    SELECT JSON_AGG(JSON_BUILD_OBJECT('id', i.id, 'url', i.imageURL))::jsonb as urls
      FROM images i
      WHERE i.customerid = cwa.id
  ) img ON TRUE
    ORDER BY cwa.id
  `

	const clientsResult = await clientsQuery

	return { clientsResult, totalCount }
}

//MARK: Fetch clients cutting
export async function fetchClientsWithSchedules(
	orgId: string,
	pageSize: number,
	offset: number,
	searchTerm: string,
	searchTermCuttingWeek: number,
	searchTermCuttingDay: string,
	searchTermAssignedTo: string,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)

	const baseQuery = sql`
    WITH clients_with_balance AS(
    SELECT 
        c.*,
    a.current_balance AS amount_owing
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      WHERE c.organization_id = ${orgId}
  ),
  clients_with_schedules AS(
    SELECT
        cwb.*,
    COALESCE(cs.cutting_week, 0) AS cutting_week,
    COALESCE(cs.cutting_day, 'No cut') AS cutting_day,
    grass_assign.user_id AS grass_assigned_to,
    grass_user.name AS grass_assigned_to_name,
    snow_assign.user_id AS snow_assigned_to
      FROM clients_with_balance cwb
      LEFT JOIN cutting_schedule cs ON cwb.id = cs.client_id
      LEFT JOIN assignments grass_assign ON cwb.id = grass_assign.client_id AND grass_assign.service_type = 'grass'
      LEFT JOIN users grass_user ON grass_assign.user_id = grass_user.id
      LEFT JOIN assignments snow_assign ON cwb.id = snow_assign.client_id AND snow_assign.service_type = 'snow'
  )
    `

	let selectQuery = sql`
    SELECT DISTINCT
cws.id
    FROM clients_with_schedules cws
  `

	const whereClauses = []

	if (searchTerm !== '') {
		whereClauses.push(sql`
  (cws.full_name ILIKE ${`%${searchTerm}%`}
    OR cws.phone_number ILIKE ${`%${searchTerm}%`}
    OR cws.email_address ILIKE ${`%${searchTerm}%`}
    OR cws.address ILIKE ${`%${searchTerm}%`})
  `)
	}

	if (searchTermCuttingWeek > 0 && searchTermCuttingDay !== '') {
		whereClauses.push(sql`
cws.cutting_week = ${searchTermCuttingWeek} 
      AND cws.cutting_day = ${searchTermCuttingDay}
`)
	} else if (searchTermCuttingWeek > 0) {
		whereClauses.push(sql`
cws.cutting_week = ${searchTermCuttingWeek}
`)
	} else if (searchTermCuttingDay !== '') {
		whereClauses.push(sql`
cws.cutting_day = ${searchTermCuttingDay}
`)
	}

	if (searchTermAssignedTo !== '') {
		whereClauses.push(
			sql`cws.grass_assigned_to_name = ${searchTermAssignedTo}`,
		)
	}

	if (whereClauses.length > 0) {
		let whereQuery = sql`WHERE ${whereClauses[0]}`
		for (let i = 1; i < whereClauses.length; i++) {
			whereQuery = sql`${whereQuery} AND ${whereClauses[i]}`
		}
		selectQuery = sql`${selectQuery} ${whereQuery}`
	}

	const countQuery = sql`
    ${baseQuery}
    SELECT COUNT(*) AS total_count
FROM(${selectQuery}) AS client_ids
  `

	const countResult = await countQuery
	const totalCount = countResult[0]?.total_count || 0

	const paginatedClientIdsQuery = sql`
    ${baseQuery}
    SELECT id
FROM(${selectQuery}) AS client_ids
    ORDER BY id
    LIMIT ${pageSize} OFFSET ${offset}
`

	const paginatedClientIdsResult = await paginatedClientIdsQuery
	const paginatedClientIds = paginatedClientIdsResult.map((row) => row.id)

	const clientsQuery = sql`
    WITH clients_with_balance AS(
  SELECT 
        c.*,
  a.current_balance AS amount_owing
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      WHERE c.organization_id = ${orgId}
),
  clients_with_schedules AS(
    SELECT
        cwb.*,
    COALESCE(cs.cutting_week, 0) AS cutting_week,
    COALESCE(cs.cutting_day, 'No cut') AS cutting_day,
    grass_assign.user_id as grass_assigned_to,
    grass_user.name as grass_assigned_to_name,
    snow_assign.user_id as snow_assigned_to
      FROM clients_with_balance cwb
      LEFT JOIN cutting_schedule cs ON cwb.id = cs.client_id
      LEFT JOIN assignments grass_assign ON cwb.id = grass_assign.client_id AND grass_assign.service_type = 'grass'
      LEFT JOIN users grass_user ON grass_assign.user_id = grass_user.id
      LEFT JOIN assignments snow_assign ON cwb.id = snow_assign.client_id AND snow_assign.service_type = 'snow'
      WHERE cwb.id = ANY(${paginatedClientIds})
  )
SELECT
cws.id,
  cws.full_name,
  cws.phone_number,
  cws.email_address,
  cws.address,
  cws.amount_owing,  
  cws.cutting_week,
  cws.cutting_day,
  cws.grass_assigned_to,
  cws.grass_assigned_to_name,
  cws.snow_assigned_to,
  COALESCE(img.urls, CAST('[]' AS JSONB)) AS images
    FROM clients_with_schedules cws
    LEFT JOIN LATERAL(
    SELECT JSON_AGG(JSON_BUILD_OBJECT('id', i.id, 'url', i.imageURL))::jsonb as urls
      FROM images i
      WHERE i.customerid = cws.id
  ) img ON TRUE
    ORDER BY cws.id
  `

	const clientsResult = await clientsQuery

	return { clientsResult, totalCount }
}

export async function fetchClientsCuttingSchedules(
	orgId: string,
	pageSize: number,
	offset: number,
	searchTerm: string,
	cuttingDate: Date,
	searchTermIsCut: boolean,
	searchTermAssignedTo: string,
) {
	const startOfYear = new Date(cuttingDate.getFullYear(), 0, 1)
	const daysSinceStart = Math.floor(
		(cuttingDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
	)
	const cuttingWeek = Math.floor((daysSinceStart % 28) / 7) + 1
	const daysOfWeek = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	]
	const cuttingDay = daysOfWeek[cuttingDate.getDay()]

	const sql = neon(`${process.env.DATABASE_URL} `)

	const query = sql`
    WITH clients_with_balance AS(
    SELECT
        c.*,
    a.current_balance AS amount_owing
      FROM clients c
      LEFT JOIN accounts a ON c.id = a.client_id
      WHERE c.organization_id = ${orgId}
  ),
  clients_with_schedules AS(
    SELECT
        cwb.*,
    cs.cutting_week,
    cs.cutting_day
      FROM clients_with_balance cwb
      JOIN cutting_schedule cs ON cwb.id = cs.client_id
      WHERE cs.cutting_week = ${cuttingWeek} AND cs.cutting_day = ${cuttingDay}
  ),
    clients_marked_cut AS(
      SELECT
        ymc.client_id,
      ymc.cutting_date
      FROM yards_marked_cut ymc
      WHERE ymc.cutting_date = ${cuttingDate}
    ),
      grass_assignments AS(
        SELECT
        sca.client_id,
        sca.user_id as assigned_to
      FROM assignments sca
      WHERE sca.service_type = 'grass'
      )
        `

	let countQuery = sql`
  SELECT COUNT(DISTINCT cws.id) AS total_count
  FROM clients_with_schedules cws
  LEFT JOIN clients_marked_cut cmc ON cws.id = cmc.client_id
  LEFT JOIN grass_assignments ga ON cws.id = ga.client_id
  WHERE ${searchTermIsCut ? sql`cmc.client_id IS NOT NULL` : sql`cmc.client_id IS NULL`}
`

	let selectQuery = sql`
  SELECT DISTINCT
cws.id,
  cws.full_name,
  cws.phone_number,
  cws.email_address,
  cws.address,
  cws.amount_owing,
  cws.cutting_week,
  cws.cutting_day,
  ga.assigned_to,
  COALESCE(img.urls, CAST('[]' AS JSONB)) AS images
  FROM clients_with_schedules cws
  LEFT JOIN clients_marked_cut cmc ON cws.id = cmc.client_id
  LEFT JOIN grass_assignments ga ON cws.id = ga.client_id
  LEFT JOIN LATERAL(
    SELECT JSON_AGG(JSON_BUILD_OBJECT('id', i.id, 'url', i.imageURL))::jsonb as urls
    FROM images i
    WHERE i.customerid = cws.id
  ) img ON TRUE
  WHERE ${searchTermIsCut ? sql`cmc.client_id IS NOT NULL` : sql`cmc.client_id IS NULL`}
`

	const whereClauses = []

	if (searchTerm !== '') {
		whereClauses.push(sql`
  (cws.full_name ILIKE ${`%${searchTerm}%`}
    OR cws.phone_number ILIKE ${`%${searchTerm}%`}
    OR cws.email_address ILIKE ${`%${searchTerm}%`}
    OR cws.address ILIKE ${`%${searchTerm}%`})
    `)
	}
	//TODO: Maybe remove if as there should never not be assigned to and we dont want to return data to just anyone
	if (searchTermAssignedTo !== '') {
		whereClauses.push(sql`ga.assigned_to = ${searchTermAssignedTo}`)
	}

	if (whereClauses.length > 0) {
		let whereClause = sql`AND ${whereClauses[0]}`
		for (let i = 1; i < whereClauses.length; i++) {
			whereClause = sql`${whereClause} AND ${whereClauses[i]}`
		}

		countQuery = sql`
      ${countQuery}
      ${whereClause}
`

		selectQuery = sql`
      ${selectQuery}
      ${whereClause}
`
	}

	const finalQuery = sql`
    ${query}
    ${selectQuery}
    ORDER BY cws.id
    LIMIT ${pageSize} OFFSET ${offset}
`

	const finalCountQuery = sql`${query} ${countQuery} `

	const [clientsResult, totalCountResult] = await Promise.all([
		finalQuery,
		finalCountQuery,
	])

	const totalCount = totalCountResult[0]?.total_count || 0

	return { clientsResult, totalCount }
}

//MARK: Mark yard cut
export async function markYardServicedDb(
	data: z.infer<typeof schemaMarkYardCut>,
	organization_id: string,
	snow: boolean,
	assigned_to: string,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)
	try {
		const query = snow
			? sql`
          INSERT INTO yards_marked_clear(client_id, clearing_date, assigned_to)
          SELECT ${data.clientId}, ${data.date}, ${assigned_to}
          FROM clients
          WHERE id = ${data.clientId} AND organization_id = ${organization_id}
          ON CONFLICT(client_id, clearing_date) DO NOTHING
          RETURNING id;
          `
			: sql`
          INSERT INTO yards_marked_cut(client_id, cutting_date, assigned_to)
          SELECT ${data.clientId}, ${data.date}, ${assigned_to}
          FROM clients
          WHERE id = ${data.clientId} AND organization_id = ${organization_id}
          ON CONFLICT(client_id, cutting_date) DO NOTHING
          RETURNING id;
          `

		const result = await query
		console.log(`
    INSERT INTO yards_marked_cut(client_id, cutting_date, assigned_to)
    SELECT ${data.clientId}, ${data.date}, ${assigned_to}
    FROM clients
    WHERE id = ${data.clientId} AND organization_id = ${organization_id}
    ON CONFLICT(client_id, cutting_date) DO NOTHING`)

		console.log('result')
		console.log(result)
		if (!result || result.length === 0) {
			throw new Error(
				'Error inserting data on table yards_marked_cut or yards_marked_clear',
			)
		}
		return result[0].id
	} catch (e) {
		console.log(e)
	}
}

export async function saveUrlImagesServices(
	snow: boolean,
	image_url: string,
	fk_id: number,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)
	console.log('fk_id')
	console.log(fk_id)
	try {
		const query = snow
			? sql`INSERT INTO images_serviced(imageurl, fk_clear_id)
  VALUES (${image_url}, ${fk_id})
  returning *;
  `
			: sql`INSERT INTO images_serviced(imageurl, fk_cut_id)
  VALUES (${image_url}, ${fk_id})
  returning *;
  `

		const result = await query
		if (!result || result.length === 0) {
			throw new Error('Error saving URLs')
		}

		return result
	} catch (e) {
		console.log(e)
	}
}

//MARK: Unassign grass cutting
export async function unassignGrassCuttingDb(
	clientId: number,
	organization_id: string,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	const result = await sql`
    DELETE FROM assignments
    WHERE client_id = ${clientId}
      AND service_type = 'grass'
      AND client_id IN (SELECT id FROM clients WHERE organization_id = ${organization_id})
    RETURNING *;
  `

	//   if (!result || result.length === 0) {
	//     throw new Error("Unassignment Failed");
	//   }

	// Does not throw error if no rows are deleted, because that means it's already unassigned.
	return result
}

//MARK: Unassign snow clearing
export async function unassignSnowClearingDb(
	clientId: number,
	organization_id: string,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	const result = await sql`
    DELETE FROM assignments
    WHERE client_id = ${clientId}
      AND service_type = 'snow'
      AND client_id IN (SELECT id FROM clients WHERE organization_id = ${organization_id})
    RETURNING *;
  `

	// Does not throw error if no rows are deleted, because that means it's already unassigned.
	return result
}

//MARK: Toggle snow client
export async function assignSnowClearingDb(
	data: z.infer<typeof schemaAssignSnow>,
	organization_id: string,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)

	const result = await sql`
    INSERT INTO assignments(client_id, user_id, service_type)
    SELECT ${data.clientId}, ${data.assignedTo}, 'snow'
    FROM clients
    WHERE id = ${data.clientId} AND organization_id = ${organization_id}
    ON CONFLICT(client_id, service_type) DO UPDATE
    SET user_id = EXCLUDED.user_id
    RETURNING *;
  `

	if (!result || result.length === 0) {
		throw new Error('Assignment Failed')
	}

	return result
}

//MARK: Assign grass cutting
export async function assignGrassCuttingDb(
	data: z.infer<typeof schemaAssign>,
	organization_id: string,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)

	const result = await sql`
    INSERT INTO assignments(client_id, user_id, service_type)
    SELECT ${data.clientId}, ${data.assignedTo}, 'grass'
    FROM clients
    WHERE id = ${data.clientId} AND organization_id = ${organization_id}
    ON CONFLICT(client_id, service_type) DO UPDATE
    SET user_id = EXCLUDED.user_id
    RETURNING *;
  `

	if (!result || result.length === 0) {
		throw new Error('Assignment Failed')
	}

	return result
}

//MARK: Mark Payment
export async function markPaidDb(
	invoiceId: string,
	stripeCustomerId: string,
	amountPaid: number,
	organizationId: string,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)
	// console.log("Amount paid: ", amountPaid)
	try {
		const result = await sql`
      WITH client_info AS(
  SELECT id AS client_id
          FROM clients
          WHERE stripe_customer_id = ${stripeCustomerId} AND organization_id = ${organizationId}
),
  inserted_payment AS(
    INSERT INTO payments(account_id, amount, organization_id)
          SELECT a.id, ${amountPaid / 100}, ${organizationId}
          FROM accounts a
          JOIN client_info ci ON a.client_id = ci.client_id
          RETURNING payments.id-- Return something to indicate success
  )
      UPDATE accounts
      SET current_balance = current_balance - ${amountPaid / 100}
      FROM client_info ci
      WHERE accounts.client_id = ci.client_id
      RETURNING accounts.current_balance AS new_balance, (SELECT id FROM inserted_payment) AS payment_id;
`

		if (!result || result.length === 0) {
			throw new Error(
				`Failed to mark invoice ${invoiceId} as paid in DB.Client not found or update failed.`,
			)
		}

		const { new_balance, payment_id } = result[0]
		// console.log(`Invoice ${invoiceId} marked paid.New balance: ${new_balance}, Payment ID: ${payment_id} `);

		return {
			success: true,
			message: `Invoice ${invoiceId} marked as paid and database updated.`,
			newBalance: new_balance,
			paymentId: payment_id,
		}
	} catch (e) {
		console.error('Error marking invoice paid in DB:', e)
		return {
			success: false,
			message:
				e instanceof Error
					? e.message
					: 'Failed to mark invoice paid in DB',
		}
	}
}
//MARK: Get clients blobs
export async function getClientsBlobsDB(orgId: string): Promise<BlobUrl[]> {
	const sql = neon(`${process.env.DATABASE_URL} `)
	const result = (await sql`
    SELECT 
        i.imageURL as url,
        'yards_marked_cut' AS source_table,
        c.id AS reference_id,
        c.cutting_date AS reference_date
    FROM 
        images_serviced i
    JOIN 
        yards_marked_cut c ON i.fk_cut_id = c.id
    JOIN 
        clients cl ON c.client_id = cl.id
    WHERE 
        cl.organization_id = ${orgId}

    UNION ALL

    SELECT 
        i.imageURL as url,
        'yards_marked_clear' AS source_table,
        cl.id AS reference_id,
        cl.clearing_date AS reference_date
    FROM 
        images_serviced i
    JOIN 
        yards_marked_clear cl ON i.fk_clear_id = cl.id
    JOIN 
        clients c ON cl.client_id = c.id
    WHERE 
        c.organization_id = ${orgId}

    UNION ALL

    SELECT
        i.imageURL as url,
        'site_map' AS source_table,
        c.id AS reference_id,
        i.created_at AS reference_date
    FROM
        images i
    JOIN
        clients c ON i.customerID = c.id
    WHERE
        c.organization_id = ${orgId};
`) as BlobUrl[]

	return result
}
