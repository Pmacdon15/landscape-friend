import { auth, clerkClient } from "@clerk/nextjs/server";
import { OrgMember } from "@/types/types-clerk";

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

export async function getOrgMembers(orgId: string): Promise<OrgMember[]> {
    if (!orgId) return [];

    try {
                        const memberships = await clerkClient.organizations.getOrganizationMembershipList({ organizationId: orgId });

        const members: OrgMember[] = memberships.map(membership => ({
            userId: membership.publicUserData.userId,
            userName: membership.publicUserData.identifier
        }));

        return members;
    } catch (error) {
        console.error('Error fetching organization members:', error);
        return [];
    }
}
