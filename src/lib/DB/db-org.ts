import { neon } from "@neondatabase/serverless";

//MARK: Get organization settings
export async function getOrganizationSettings(organization_id: string): Promise<{ max_allowed_clinents: number } | null> {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const result = await sql`
    SELECT max_allowed_clinents FROM organizations WHERE organization_id = ${organization_id}
  `;
  if (result.length > 0) {
    return result[0] as { max_allowed_clinents: number };
  }
  return null;
}

export async function getOrganizationUniqueId(organization_id: string): Promise<{ id: string } | null> {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const result = await sql`
    SELECT id FROM organizations WHERE organization_id = ${organization_id}
  `;
  if (result.length > 0) {
    return result[0] as { id: string };
  }
  return null;
}

export async function handleOrganizationCreatedDb(orgId: string, orgName: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  await sql`
        INSERT INTO organizations (organization_id, organization_name)
        VALUES (${orgId}, ${orgName});               
    `;
}