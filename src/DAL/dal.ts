import { fetchClientsWithSchedules, fetchClientsCuttingSchedules, FetchAllUnCutAddressesDB, fetchClientNamesAndEmailsDb, fetchStripAPIKeyDb, fetchClientsClearingGroups } from "@/lib/db";
import { processClientsResult } from "@/lib/sort";
import { Address, ClientResult, NamesAndEmails, PaginatedClients, APIKey, OrgMember } from "@/types/types";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function fetchAllClients(clientPageNumber: number, searchTerm: string, searchTermCuttingWeek: number, searchTermCuttingDay: string):
  Promise<PaginatedClients | null> {
  const { orgId, userId } = await auth.protect();
  const pageSize = Number(process.env.PAGE_SIZE) || 10;
  const offset = (clientPageNumber - 1) * pageSize;

  const result = await fetchClientsWithSchedules(orgId || userId, pageSize, offset, searchTerm, searchTermCuttingWeek, searchTermCuttingDay);

  if (!result.clientsResult) return null;

  const { clients, totalPages } = processClientsResult(result.clientsResult as ClientResult[], result.totalCount, pageSize);

  return { clients, totalPages };
}



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

export async function fetchCuttingClients(
  clientPageNumber: number,
  searchTerm: string,
  cuttingDate: Date,
  searchTermIsCut: boolean
): Promise<PaginatedClients | null> {
  const { orgId, userId } = await auth.protect();
  const pageSize = Number(process.env.PAGE_SIZE) || 10;
  const offset = (clientPageNumber - 1) * pageSize;

  const result = await fetchClientsCuttingSchedules(
    orgId || userId,
    pageSize,
    offset,
    searchTerm,
    cuttingDate,
    searchTermIsCut
  );

  if (!result.clientsResult) return null;

  const { clients, totalPages } = processClientsResult(
    result.clientsResult as ClientResult[],
    result.totalCount,
    pageSize
  );

  return {
    clients,
    totalPages,
    totalClients: result.totalCount
  };
}

export async function fetchSnowClearingClients(
  clientPageNumber: number,
  searchTerm: string,
  searchTermIsServiced: boolean,
  searchTermAssignedTo: string
) {
  const { orgId, userId } = await auth.protect();
  const pageSize = Number(process.env.PAGE_SIZE) || 10;
  const offset = (clientPageNumber - 1) * pageSize;

  const result = await fetchClientsClearingGroups(
    orgId || userId,
    pageSize,
    offset,
    searchTerm,
    searchTermAssignedTo
  );

  // const { clients, totalPages } = result
  // return {
  //   clients,
  //   totalPages,
  // };
}

export async function fetchAllUnCutAddresses(searchTermCuttingDate: Date): Promise<Address[] | null | Error> {
  const { orgId, userId } = await auth.protect();

  try {
    const result = await FetchAllUnCutAddressesDB(orgId || userId, searchTermCuttingDate);

    if (!result) return null;
    return result;
  } catch (e) {
    if (e instanceof Error)
      return e; // Return the error directly
    else
      return new Error('An unknown error occurred'); // Return a generic error
  }
}

export async function fetchClientsNamesAndEmails(): Promise<NamesAndEmails[] | Error> {
  const { orgId, userId } = await auth.protect();
  try {
    const result = await fetchClientNamesAndEmailsDb(orgId || userId)
    if (!result) return [];
    return result
  } catch (e) {
    if (e instanceof Error)
      return e;
    return new Error('An unknown error occurred'); // Return a generic error
  }
}

export async function fetchStripAPIKey(): Promise<APIKey | Error> {
  const { orgId, userId } = await auth.protect();
  try {
    const result = await fetchStripAPIKeyDb(orgId || userId);
    if (!result || !result.api_key) return new Error('API key not found');
    return { apk_key: result.api_key };
  } catch (e) {
    if (e instanceof Error)
      return e;
    return new Error('An unknown error occurred');
  }
}