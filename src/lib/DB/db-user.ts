
import { neon } from "@neondatabase/serverless";
import { UserNovuId } from "@/types/types-novu";

export async function fetchUniqueIdDb(userId: string): Promise<UserNovuId | null> {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const result = await sql`SELECT novu_subscriber_id FROM users WHERE id = ${userId}`;
  if (result.length > 0) {
    return { UserNovuId: result[0].novu_subscriber_id };
  }
  return null;
}


export async function addResendIdToDb(orgId: string, resendId: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);  
    const result = await sql`
      UPDATE organizations
      SET resend_id = ${resendId}
      WHERE organization_id = ${orgId}
      RETURNING *;
    `;
    return result;

}