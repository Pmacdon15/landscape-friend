import { auth, clerkClient } from "@clerk/nextjs/server"
import { neon } from "@neondatabase/serverless"

export async function isOrgAdmin() {
    const { userId, orgId, sessionClaims } = await auth.protect()
    let isAdmin = true
    if (orgId && sessionClaims.orgRole !== "org:admin") isAdmin = false
    return { userId, orgId, sessionClaims, isAdmin }
}

export async function handleSubscriptionUpdate(orgId: string, plan: string) {
    const clerk = await clerkClient();

    if (plan === 'basic_10_people_org') {
        await clerk.organizations.updateOrganization(orgId, {
            maxAllowedMemberships: 10
        });
    } else if (plan === 'pro_25_people_org') {
        await clerk.organizations.updateOrganization(orgId, {
            maxAllowedMemberships: 25
        })
    } else {
        await clerk.organizations.updateOrganization(orgId, {
            maxAllowedMemberships: 1
        })
    }
}

export async function handleOrganizationCreated(orgId: string) {
    console.log("Org or user Created", orgId)
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`
        INSERT INTO price_per_cut (organization_id)
        VALUES (${orgId})        
    `;
}

export async function handleOrganizationDeleted(orgId: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`
        DELETE FROM price_per_cut
        WHERE organization_id = ${orgId}        
    `;
}