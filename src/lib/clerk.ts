import { auth } from "@clerk/nextjs/server";

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
