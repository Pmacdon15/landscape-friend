import { type NeonQueryFunction, neon } from '@neondatabase/serverless'
import type z from 'zod'
import type {
	schemaAddClient,
	schemaDeleteClient,
	schemaDeleteSiteMap,
	schemaMarkYardCut,
	schemaUpdateCuttingDay,
} from '@/lib/zod/schemas'
import type {
	ClientAssignment,
	ScheduledClient,
} from '@/types/assignment-types'
import type { BlobUrl } from '@/types/blob-types'
import type {
	Client,
	ClientAccount,
	ClientAddress,
	ClientInfoList,
	CustomerName,
} from '@/types/clients-types'
import type { NovuSubscriberIds } from '@/types/novu-types'
import type { ClientCuttingSchedule } from '@/types/schedules-types'
import type { ClientSiteMapImages } from '@/types/site-maps-types'

//MARK: Add clients
export async function addClientDB(
	data: z.infer<typeof schemaAddClient>,
	organization_id: string,
): Promise<Client> {
	const databaseUrl = process.env.DATABASE_URL
	if (!databaseUrl) {
		throw new Error('DATABASE_URL environment variable is not set')
	}

	const sql = neon(databaseUrl)

	/* ------------------------
	   1. Insert client
	------------------------ */
	const [client] = (await sql`
		INSERT INTO clients (
			full_name,
			phone_number,
			email_address,
			organization_id,
			stripe_customer_id
		)
		VALUES (
			${data.full_name},
			${data.phone_number},
			${data.email_address},
			${organization_id},
			${data.stripe_customer_id ?? null}
		)
		RETURNING *
	`) as Client[]

	await sql`
		INSERT INTO accounts (client_id)
		VALUES (${client.id})
	`

	await Promise.allSettled(
		data.addresses?.map(
			(addr) =>
				sql`
				INSERT INTO client_addresses (client_id, address)
				VALUES (${client.id}, ${addr.address})
				RETURNING *
			`,
		) ?? [],
	)

	return client
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
): Promise<{ success: boolean }> {
	// console.log("deleteSiteMapDB called with data:", data, "and organization_id:", organization_id);
	const sql = neon(`${process.env.DATABASE_URL}`)
	try {
		const result = await sql`
    DELETE FROM images
    WHERE
      id = ${data.siteMap_id} 
    RETURNING id;
  `
		// console.log("deleteSiteMapDB SQL result:", result);
		return { success: result.length > 0 }
	} catch (error) {
		console.error('Error in deleteSiteMapDB SQL query:', error)
		throw error
	}
}

//MARK: Updated Client Cut Day
export async function updatedClientCutDayDb(
	data: z.infer<typeof schemaUpdateCuttingDay>,
	// orgId: string,
) {
	const sql = neon(`${process.env.DATABASE_URL} `)

	const result = await sql`
        INSERT INTO cutting_schedule(address_id, cutting_week, cutting_day)
		VALUES(${data.addressId}, ${data.cuttingWeek}, ${data.updatedDay})
			ON CONFLICT(address_id, cutting_week) DO UPDATE
			SET cutting_day = EXCLUDED.cutting_day, cutting_week = EXCLUDED.cutting_week
		RETURNING *
    `
	return result
}
//MARK: Fetch client list
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
//MARK: Fetch clients assigned for snow clearing
export async function fetchClientsClearingGroupsDb(
	orgId: string,
	searchTerm: string,
	clearingDate: Date,
	userId: string | null,
	searchTermIsServiced?: boolean,
	searchTermAssignedTo?: string,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	// Determine which user to filter assignments by
	const assignedToFilter = searchTermAssignedTo || userId

	// Base query: all clients in the org with their snow assignments
	let baseQuery = sql`
		SELECT 
			c.id, 
			c.full_name, 
			c.phone_number, 
			c.email_address, 
			ca.address, 
			ca.id as address_id,
			a.id AS assignment_id, 
			a.user_id, 
			a.priority
		FROM clients c
		JOIN client_addresses ca ON ca.client_id = c.id
		JOIN assignments a ON a.address_id = ca.id
		WHERE c.organization_id = ${orgId}
		  AND a.service_type = 'snow'
	`

	// Filter by assigned user
	if (assignedToFilter) {
		baseQuery = sql`${baseQuery} AND a.user_id = ${assignedToFilter}`
	}

	// Filter by search term
	if (searchTerm && searchTerm.trim() !== '') {
		const term = `%${searchTerm}%`
		baseQuery = sql`${baseQuery} AND (
			c.full_name ILIKE ${term} OR
			c.phone_number ILIKE ${term} OR
			c.email_address ILIKE ${term} OR
			ca.address ILIKE ${term}
		)`
	}

	// Filter by whether already cleared
	if (searchTermIsServiced !== undefined) {
		if (searchTermIsServiced) {
			baseQuery = sql`${baseQuery} AND EXISTS (
      SELECT 1
      FROM yards_marked_clear ymc
      WHERE ymc.address_id = ca.id
        AND ymc.clearing_date = ${clearingDate}
    )`
		} else {
			baseQuery = sql`${baseQuery} AND NOT EXISTS (
      SELECT 1
      FROM yards_marked_clear ymc
      WHERE ymc.address_id = ca.id
        AND ymc.clearing_date = ${clearingDate}
    )`
		}
	}

	// Order by assignment priority then client id
	baseQuery = sql`${baseQuery} ORDER BY a.priority, c.id`

	const clientsResult = await baseQuery
	return clientsResult as ScheduledClient[]
}

export async function fetchClients(
	orgId: string,
	pageSize: number,
	offset: number,
	searchTerm?: string,
	cuttingWeek?: number,
	cuttingDay?: string,
	assignedTo?: string,
): Promise<{
	clients: Client[]
	addresses: ClientAddress[]
	accounts: ClientAccount[]
	assignments: ClientAssignment[]
	schedules: ClientCuttingSchedule[]
	siteMaps: ClientSiteMapImages[]
	totalPages: number
} | null> {
	const sql = neon(process.env.DATABASE_URL as string)

	/* ---------------- WHERE CLAUSE ---------------- */

	let whereSql = sql`c.organization_id = ${orgId}`

	if (searchTerm) {
		const like = `%${searchTerm.toLowerCase()}%`
		whereSql = sql`${whereSql} AND (
			LOWER(c.full_name) LIKE ${like}
			OR CAST(c.id AS TEXT) LIKE ${like}
			OR LOWER(c.email_address) LIKE ${like}
			OR LOWER(c.phone_number) LIKE ${like}
			OR EXISTS (
				SELECT 1
				FROM client_addresses ca
				WHERE ca.client_id = c.id
				AND LOWER(ca.address) LIKE ${like}
			)
		)`
	}

	if (cuttingWeek || cuttingDay) {
		whereSql = sql`${whereSql} AND EXISTS (
			SELECT 1
			FROM cutting_schedule cs
			INNER JOIN client_addresses ca ON ca.id = cs.address_id
			WHERE ca.client_id = c.id
			${cuttingWeek ? sql`AND cs.cutting_week = ${cuttingWeek}` : sql``}
			${cuttingDay ? sql`AND cs.cutting_day = ${cuttingDay}` : sql``}
		)`
	}

	if (assignedTo) {
		whereSql = sql`${whereSql} AND EXISTS (
			SELECT 1
			FROM assignments a
			INNER JOIN client_addresses ca ON ca.id = a.address_id
			WHERE ca.client_id = c.id
			AND a.assigned_to = ${assignedTo}
		)`
	}

	/* ---------------- TOTAL COUNT ---------------- */

	const countResult = await sql`
		SELECT COUNT(*)::int AS count
		FROM clients c
		WHERE ${whereSql}
	`

	const totalCount = countResult[0]?.count ?? 0
	const totalPages = Math.ceil(totalCount / pageSize)

	/* ---------------- DATA QUERY ---------------- */

	const results = (await sql`
		SELECT
			c.*,
			(SELECT json_agg(acc) FROM accounts acc WHERE acc.client_id = c.id) AS accounts,
			(SELECT json_agg(ca) FROM client_addresses ca WHERE ca.client_id = c.id) AS addresses,
			(
				SELECT json_agg(a)
				FROM assignments a
				INNER JOIN client_addresses ca ON a.address_id = ca.id
				WHERE ca.client_id = c.id
			) AS assignments,
			(
				SELECT json_agg(cs)
				FROM cutting_schedule cs
				INNER JOIN client_addresses ca ON cs.address_id = ca.id
				WHERE ca.client_id = c.id
			) AS schedules,
			(
				SELECT json_agg(
					json_build_object(
						'id', i.id,
						'address_id', i.address_id,
						'address', ca.address,
						'imageURL', i.imageURL,
						'isActive', i.isActive,
						'client_id', ca.client_id
					)
				)
				FROM images i
				INNER JOIN client_addresses ca ON i.address_id = ca.id
				WHERE ca.client_id = c.id
			) AS "siteMaps"
		FROM clients c
		WHERE ${whereSql}
		ORDER BY c.id DESC
		LIMIT ${pageSize}
		OFFSET ${offset}
	`) as (Client & {
		accounts: ClientAccount[] | null
		addresses: ClientAddress[] | null
		assignments: ClientAssignment[] | null
		schedules: ClientCuttingSchedule[] | null
		siteMaps: ClientSiteMapImages[] | null
	})[]

	/* ---------------- FLATTEN ---------------- */

	const clients: Client[] = []
	const accounts: ClientAccount[] = []
	const addresses: ClientAddress[] = []
	const assignments: ClientAssignment[] = []
	const schedules: ClientCuttingSchedule[] = []
	const siteMaps: ClientSiteMapImages[] = []

	for (const row of results) {
		const {
			accounts: accs,
			addresses: addrs,
			assignments: asgns,
			schedules: scheds,
			siteMaps: sms,
			...clientData
		} = row

		clients.push(clientData as Client)
		if (accs) accounts.push(...accs)
		if (addrs) addresses.push(...addrs)
		if (asgns) assignments.push(...asgns)
		if (scheds) schedules.push(...scheds)
		if (sms) siteMaps.push(...sms)
	}

	return {
		clients,
		accounts,
		addresses,
		assignments,
		schedules,
		siteMaps,
		totalPages,
	}
}

// export async function fetchClients(
// 	orgId: string,
// 	_pageSize: number,
// 	_offset: number,
// 	_searchTerm: string,
// 	_searchTermCuttingWeek: number,
// 	_searchTermCuttingDay: string,
// 	_searchTermAssignedTo: string,
// ) {
// 	const sql = neon(`${process.env.DATABASE_URL} `)

// 	return (await sql`

//         SELECT * FROM clients WHERE organization_id = ${orgId}

//   `) as Client[]
// }
// //MARK: Fetch client accounts for an array of clients
// export async function fetchClientsAccounts(
// 	clientIds: number[],
// ): Promise<ClientAccount[]> {
// 	if (clientIds.length === 0) return []

// 	const sql = neon(`${process.env.DATABASE_URL}`)

// 	return (await sql`
// 		SELECT *
// 		FROM accounts
// 		WHERE client_id = ANY(${clientIds})
// 	`) as ClientAccount[]
// }

//MARK: Fetch client addresses for an array of clients
export async function fetchClientsAddresses(
	clientIds: number[],
): Promise<ClientAddress[]> {
	if (clientIds.length === 0) return []

	const sql = neon(`${process.env.DATABASE_URL}`)

	return (await sql`
		SELECT *
		FROM client_addresses
		WHERE client_id = ANY(${clientIds})
	`) as ClientAddress[]
}

//MARK: Fetch cutting schedules
export async function fetchClientsCuttingSchedules(
	orgId: string,
	searchTerm: string,
	cuttingDate: Date,
	searchTermIsCut?: boolean,
	searchTermAssignedTo?: string,
): Promise<ScheduledClient[]> {
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
	const date = cuttingDate.toISOString().split('T')[0]

	const sql = neon(`${process.env.DATABASE_URL}`)

	// Base query: clients in org with assignments and cutting schedule for that day
	let baseQuery = sql`
		SELECT 
			c.id,
			c.full_name,
			c.phone_number,
			c.email_address,
			ca.address,
			ca.id AS address_id,
			a.id AS assignment_id,
			a.user_id,
			a.priority
		FROM clients c
		JOIN client_addresses ca ON ca.client_id = c.id
		JOIN cutting_schedule cs ON ca.id = cs.address_id
		LEFT JOIN assignments a ON a.address_id = ca.id AND a.service_type = 'grass'
		WHERE c.organization_id = ${orgId}
		  AND cs.cutting_week = ${cuttingWeek}
		  AND cs.cutting_day = ${cuttingDay}
	`
	if (searchTermIsCut !== undefined) {
		const subquery = searchTermIsCut
			? sql`EXISTS (
					SELECT 1
					FROM yards_marked_cut ymc
					WHERE ymc.address_id = ca.id AND ymc.cutting_date = ${date}
				)`
			: sql`NOT EXISTS (
					SELECT 1
					FROM yards_marked_cut ymc
					WHERE ymc.address_id = ca.id AND ymc.cutting_date = ${date}
				)`
		baseQuery = sql`${baseQuery} AND ${subquery}`
	}
	// Filter by assigned user if provided
	if (searchTermAssignedTo && searchTermAssignedTo.trim() !== '') {
		baseQuery = sql`${baseQuery} AND a.user_id = ${searchTermAssignedTo}`
	}

	// Filter by search term if provided
	if (searchTerm && searchTerm.trim() !== '') {
		const term = `%${searchTerm}%`
		baseQuery = sql`${baseQuery} AND (
			c.full_name ILIKE ${term} OR
			c.phone_number ILIKE ${term} OR
			c.email_address ILIKE ${term} OR
			ca.address ILIKE ${term}
		)`
	}

	const clientsResult = await baseQuery

	return clientsResult as ScheduledClient[]
}

//MARK: Mark yard cut
export async function markYardServicedDb(
	data: z.infer<typeof schemaMarkYardCut>,
	snow: boolean,
	assigned_to: string,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)
	console.log('Marking client serviced payload:', JSON.stringify(data))

	// Validate inputs
	if (!data.addressId || typeof data.addressId !== 'number') {
		throw new Error('Invalid addressId')
	}
	if (!assigned_to || typeof assigned_to !== 'string') {
		throw new Error('Invalid assigned_to')
	}

	// Convert date to YYYY-MM-DD
	const dateValue =
		data.date instanceof Date
			? data.date.toISOString().split('T')[0]
			: data.date

	try {
		const query = snow
			? sql`
          INSERT INTO yards_marked_clear (address_id, clearing_date, assigned_to)
          VALUES (${data.addressId}, ${dateValue}, ${assigned_to})
          RETURNING *
        `
			: sql`
          INSERT INTO yards_marked_cut (address_id, cutting_date, assigned_to)
          VALUES (${data.addressId}, ${dateValue}, ${assigned_to})
          RETURNING *
        `

		const result = await query
		console.log('Inserted record:', result)
		return result
	} catch (e) {
		console.error(
			'Error inserting data on table yards_marked_cut or yards_marked_clear',
			e,
		)
		throw e
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

export async function getClientByIdDb(
	clientId: number,
): Promise<Client | null> {
	const sql = neon(`${process.env.DATABASE_URL}`)
	try {
		const result = await sql`
            SELECT * FROM clients WHERE id = ${clientId}
        `
		if (result.length === 0) {
			return null
		}
		return result[0] as unknown as Client
	} catch (error) {
		console.error('Error in getClientByIdDb SQL query:', error)
		throw error
	}
}

export async function updateClientStripeIdByIdDb(
	clientId: number,
	stripe_customer_id: string,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)
	try {
		const result = await sql`
            UPDATE clients
            SET stripe_customer_id = ${stripe_customer_id}
            WHERE id = ${clientId}
            RETURNING *;
        `
		return result
	} catch (error) {
		console.error('Error in updateClientStripeIdByIdDb SQL query:', error)
	}
}

export async function updateClientInfoDb(
	clientId: number,
	clientName: string,
	clientEmail: string | null | undefined,
	phoneNumber: string | null | undefined,
	addresses: { address: string }[],
	stripeCustomerId?: string,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)
	const stringPhoneNumber = phoneNumber ? String(phoneNumber) : null
	try {
		const result = await sql`
			UPDATE clients
			SET
				full_name = ${clientName},
				email_address = ${clientEmail},
				phone_number = ${stringPhoneNumber}
			WHERE id = ${clientId}
			RETURNING *;
		`

		if (stripeCustomerId) {
			await sql`
				UPDATE clients
				SET stripe_customer_id = ${stripeCustomerId}
				WHERE id = ${clientId};	`
		}

		await syncClientAddresses(sql, clientId, addresses ?? [])
		return result
	} catch (error) {
		console.error('Error in updateClientInfoDb SQL query:', error)
		throw error
	}
}
const normalize = (a: string) => a.trim()

async function syncClientAddresses(
	sql: NeonQueryFunction<false, false>,
	clientId: number,
	newAddresses: { address: string }[],
) {
	// 1️⃣ Get existing addresses
	const existing = (await sql`
		SELECT id, address
		FROM client_addresses
		WHERE client_id = ${clientId}
	`) as { id: number; address: string }[]

	const existingSet = new Set(existing.map((a) => normalize(a.address)))
	const incomingSet = new Set(newAddresses.map((a) => normalize(a.address)))

	// 2️⃣ Determine inserts
	const toInsert = newAddresses.filter(
		(a) => !existingSet.has(normalize(a.address)),
	)

	// 3️⃣ Determine deletes
	const toDelete = existing.filter(
		(a) => !incomingSet.has(normalize(a.address)),
	)

	// 4️⃣ Insert new addresses
	await Promise.all(
		toInsert.map(
			(addr) =>
				sql`
				INSERT INTO client_addresses (client_id, address)
				VALUES (${clientId}, ${addr.address})
			`,
		),
	)

	// 5️⃣ Delete removed addresses
	await Promise.all(
		toDelete.map(
			(addr) =>
				sql`
				DELETE FROM client_addresses
				WHERE id = ${addr.id}
			`,
		),
	)
}

export async function updateStripeCustomerIdDb(
	clientId: number,
	stripeCustomerId: string,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	const result = await sql`
            UPDATE clients
            SET
                stripe_customer_id = ${stripeCustomerId}
            WHERE id = ${clientId}
            RETURNING *;
        `
	if (result.length > 0) return true
	else return false
}
