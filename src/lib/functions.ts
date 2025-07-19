import { auth } from "@clerk/nextjs/server"

export async function isOrgAdmin() {
    const { userId, orgId, sessionClaims } = await auth.protect()
    let isAdmin = true
    if (orgId && sessionClaims.orgRole !== "org:admin") isAdmin = false
    return { userId, orgId, sessionClaims, isAdmin }
}