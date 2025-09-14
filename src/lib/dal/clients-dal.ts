import { fetchClientsWithSchedules, fetchClientsCuttingSchedules, fetchClientsClearingGroupsDb, fetchStripeCustomerNamesDB, fetchClientListDb } from "@/lib/DB/clients-db";
import { fetchClientNamesAndEmailsDb } from "@/lib/DB/resend-db";
import { processClientsResult } from "@/lib/utils/sort";
import { isOrgAdmin } from "@/lib/utils/clerk";
import { ClientResult, NamesAndEmails, PaginatedClients, CustomerName, ClientInfoList } from "@/types/clients-types";
import { auth } from "@clerk/nextjs/server";

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
//TODO: Abstract this 
export async function fetchClientList(): Promise<ClientInfoList[]> {
  const { orgId, userId } = await isOrgAdmin();
  if (!orgId && !userId) {
    throw new Error("Organization ID or User ID is missing.");
  }
  const organizationId = orgId || userId;
  if (!organizationId) {
    throw new Error("Organization ID or User ID is missing.");
  }
  const result = await fetchClientListDb(organizationId);
  if (!result) {
    throw new Error("Failed to fetch client list.");
  }
  return result;
}
export async function fetchCuttingClients(
  clientPageNumber: number,
  searchTerm: string,
  cuttingDate: Date,
  searchTermIsCut: boolean,
  searchTermAssignedTo: string
): Promise<PaginatedClients | null> {
  const { orgId, userId, isAdmin } = await isOrgAdmin()

  if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");
  if (!isAdmin && userId !== searchTermAssignedTo) throw new Error("Not admin can not view other coworkers list")

  let assignedTo
  if (searchTermAssignedTo === "") assignedTo = userId
  else assignedTo = searchTermAssignedTo

  if (!assignedTo) throw new Error("Can not search with no one assigned.")

  const pageSize = Number(process.env.PAGE_SIZE) || 10;
  const offset = (clientPageNumber - 1) * pageSize;

  const result = await fetchClientsCuttingSchedules(
    (orgId || userId)!,
    pageSize,
    offset,
    searchTerm,
    cuttingDate,
    searchTermIsCut,
    assignedTo
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
  clearingDate: Date,
  searchTermIsServiced: boolean,
  searchTermAssignedTo: string
): Promise<PaginatedClients | null> {
  const { orgId, userId, isAdmin } = await isOrgAdmin()

  if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");
  if (!isAdmin && userId !== searchTermAssignedTo) throw new Error("Not admin can not view other coworkers list")

  let assignedTo
  if (searchTermAssignedTo === "") assignedTo = userId
  else assignedTo = searchTermAssignedTo

  if (!assignedTo) throw new Error("Can not search with no one assigned.")

  const pageSize = Number(process.env.PAGE_SIZE) || 10;
  const offset = (clientPageNumber - 1) * pageSize;

  const result = await fetchClientsClearingGroupsDb(
    (orgId || userId)!,
    pageSize,
    offset,
    searchTerm,
    clearingDate,
    searchTermIsServiced,
    assignedTo
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

export async function fetchClientNamesByStripeIds(stripeCustomerIds: string[]): Promise<CustomerName[] | Error> {
  const { orgId, userId } = await auth.protect();
  try {
    const result = await fetchStripeCustomerNamesDB(orgId || userId, stripeCustomerIds);
    if (!result) return [];
    return result;
  } catch (e) {
    if (e instanceof Error)
      return e;
    return new Error('An unknown error occurred');
  }
}