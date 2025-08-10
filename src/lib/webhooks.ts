import { auth, clerkClient } from "@clerk/nextjs/server"
import { neon } from "@neondatabase/serverless"

export async function isOrgAdmin(protect = true) {
    let authResult;
    if (protect) {
        authResult = await auth.protect();
    } else {
        authResult = await auth();
    }

    const { userId, orgId, sessionClaims } = authResult;
    let isAdmin = true;
    if (orgId && sessionClaims.orgRole !== "org:admin") isAdmin = false;

    return { userId, orgId, sessionClaims, isAdmin };
}

export async function handleOrganizationCreated(orgId: string, orgName: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`
        INSERT INTO organizations (organization_id, organization_name)
        VALUES (${orgId}, ${orgName});               
    `;
}

export async function handleOrganizationDeleted(orgId: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`
        DELETE FROM price_per_cut
        WHERE organization_id = ${orgId}        
    `;
}


