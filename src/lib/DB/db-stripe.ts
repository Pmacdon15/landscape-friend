import { neon } from "@neondatabase/serverless";
import { schemaUpdateAPI } from "../zod/schemas";
import z from "zod";

//MARK: Update Strip API Key
export async function updatedStripeAPIKeyDb(data: z.infer<typeof schemaUpdateAPI>, orgId: string) {
    const sql = neon(process.env.DATABASE_URL!);
    try {
        await (sql`
      INSERT INTO stripe_api_keys (organization_id, api_key)
      VALUES (${orgId}, ${data.APIKey})
      ON CONFLICT ON CONSTRAINT unique_organization_id DO UPDATE
      SET api_key = ${data.APIKey}
    `);
        return { success: true, message: 'API key updated successfully' };
    } catch (e) {
        console.error('Error updating API key:', e);
        return { success: false, message: e instanceof Error ? e.message : 'Failed to update API key' };
    }
}

//MARK:fetch Strip API Key
export async function fetchStripAPIKeyDb(orgId: string) {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await (sql`
    SELECT 
      api_key
    FROM stripe_api_keys 
    WHERE organization_id = ${orgId}
  `) as { api_key: string }[];
    return result[0];
}