import { OrgMember } from "@/types/types-clerk";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function fetchOrgMembers(): Promise<OrgMember[]> {
  const { orgId, sessionClaims } = await auth.protect();

  if (!orgId) {
    // If there's no organization, return the current user's information
    return [
      {
        userId: sessionClaims.sub,
        userName: sessionClaims.userFullName as string | null,
      },
    ];
  }

  const clerk = await clerkClient();
  try {
    const response = await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    // Transform OrganizationMembership objects into the simplified OrgMember type
    const orgMembers: OrgMember[] = response.data.flatMap(member => {
      const userId = member.publicUserData?.userId;
      if (!userId) {
        return []; // Skip this member if userId is not available
      }

      const userName = member.publicUserData?.firstName && member.publicUserData?.lastName
        ? `${member.publicUserData.firstName} ${member.publicUserData.lastName}`
        : member.publicUserData?.firstName ?? null;

      return [{
        userId: userId,
        userName: userName,
      }];
    });

    return orgMembers;
  } catch (error) {
    console.error("Error fetching org members:", error);
    throw error;
  }
}
