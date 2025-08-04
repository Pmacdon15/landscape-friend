import { fetchClientsWithSchedules, fetchClientsServiceSchedules, fetchAllUnServicedAddressesDB, fetchClientNamesAndEmailsDb, fetchStripAPIKeyDb } from "@/lib/db";
import { processClientsResult } from "@/lib/sort";
import { Address, ClientResult, NamesAndEmails, PaginatedClients, APIKey } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export async function FetchAllClients(clientPageNumber: number, searchTerm: string, searchTermServiceWeek: number, searchTermServiceDay: string):
  Promise<PaginatedClients | null> {
  const { orgId, userId } = await auth.protect();
  const pageSize = Number(process.env.PAGE_SIZE) || 10;
  const offset = (clientPageNumber - 1) * pageSize;

  const result = await fetchClientsWithSchedules(orgId || userId, pageSize, offset, searchTerm, searchTermServiceWeek, searchTermServiceDay);

  if (!result.clientsResult) return null;

  const { clients, totalPages } = processClientsResult(result.clientsResult as ClientResult[], result.totalCount, pageSize);

  return { clients, totalPages };
}

export async function fetchServiceClients(
  clientPageNumber: number,
  searchTerm: string,
  serviceDate: Date,
  searchTermIsServiced: boolean
): Promise<PaginatedClients | null> {
  const { orgId, userId } = await auth.protect();
  const pageSize = Number(process.env.PAGE_SIZE) || 10;
  const offset = (clientPageNumber - 1) * pageSize;

  const result = await fetchClientsServiceSchedules(
    orgId || userId,
    pageSize,
    offset,
    searchTerm,
    serviceDate,
    searchTermIsServiced
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

export async function fetchAllUnServicedAddresses(searchTermServiceDate: Date): Promise<Address[] | null | Error> {
  const { orgId, userId } = await auth.protect();

  try {
    const result = await fetchAllUnServicedAddressesDB(orgId || userId, searchTermServiceDate);

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