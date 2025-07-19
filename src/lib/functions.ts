import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function isOrgAdmin() {
    const { userId, orgId, sessionClaims } = await auth.protect()
    if (orgId && sessionClaims.org_role !== "org:admin") redirect("/")
    return { userId, orgId, sessionClaims }
}