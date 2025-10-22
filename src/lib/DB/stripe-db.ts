import { neon } from '@neondatabase/serverless'
import type z from 'zod'
import type { schemaUpdateAPI } from '../zod/schemas'

//MARK: Update Strip API Key
export async function updatedStripeAPIKeyDb(
	data: z.infer<typeof schemaUpdateAPI>,
	orgId: string,
) {
	const sql = neon(process.env.DATABASE_URL!)
	try {
		await sql`
    INSERT INTO stripe_api_keys (organization_id, api_key)
    VALUES (${orgId}, ${data.APIKey})
    ON CONFLICT (organization_id) DO UPDATE SET
      api_key = EXCLUDED.api_key     
    RETURNING *;
`
		// console.log("Result: ", result)
		return { success: true, message: 'API key added successfully' }
	} catch (e) {
		console.error('Error adding API key:', e)
		return {
			success: false,
			message: e instanceof Error ? e.message : 'Failed to add API key',
		}
	}
}

//MARK:fetch Strip API Key
export async function fetchStripAPIKeyDb(orgId: string) {
	const sql = neon(process.env.DATABASE_URL!)
	const result = (await sql`
    SELECT 
      api_key
    FROM stripe_api_keys 
    WHERE organization_id = ${orgId}
  `) as { api_key: string }[]
	return result[0]
}

//MARK: Store Webhook Secret
export async function storeWebhookInfoDb(
	orgId: string,
	webhookSecret: string,
	webhookId: string,
) {
	const sql = neon(process.env.DATABASE_URL!)
	try {
		await sql`
    UPDATE stripe_api_keys
    SET webhook_secret = ${webhookSecret},
    webhook_id = ${webhookId}
    WHERE organization_id = ${orgId}
    RETURNING *;
`
		return { success: true, message: 'Webhook secret stored successfully' }
	} catch (e) {
		console.error('Error storing webhook secret:', e)
		return {
			success: false,
			message:
				e instanceof Error
					? e.message
					: 'Failed to store webhook secret',
		}
	}
}

//MARK: Fetch Webhook Secret
export async function fetchWebhookSecretDb(orgId: string) {
	const sql = neon(process.env.DATABASE_URL!)
	const result = (await sql`
    SELECT 
      webhook_secret
    FROM stripe_api_keys 
    WHERE organization_id = ${orgId}
  `) as { webhook_secret: string }[]
	return result[0]
}

//MARK: Fetch Webhook ID
export async function fetchWebhookIdDb(orgId: string) {
	const sql = neon(process.env.DATABASE_URL!)
	const result = (await sql`
    SELECT 
      webhook_id
    FROM stripe_api_keys 
    WHERE organization_id = ${orgId}
  `) as { webhook_id: string }[]
	return result[0]
}

//MARK: Delete Webhook ID
export async function deleteWebhookIdDb(orgId: string) {
	const sql = neon(process.env.DATABASE_URL!)
	try {
		await sql`
    UPDATE stripe_api_keys
    SET webhook_secret = NULL,
    webhook_id = NULL
    WHERE organization_id = ${orgId}
    RETURNING *;
`
		return { success: true, message: 'Webhook info deleted successfully' }
	} catch (e) {
		console.error('Error deleting webhook info:', e)
		return {
			success: false,
			message:
				e instanceof Error
					? e.message
					: 'Failed to delete webhook info',
		}
	}
}
