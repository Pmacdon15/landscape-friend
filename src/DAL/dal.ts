import { fetchClientsWithSchedules, fetchClientsCuttingSchedules } from "@/lib/db";
import { processClientsResult } from "@/lib/sort";
import { ClientResult, PaginatedClients } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export async function FetchAllClients(clientPageNumber: number, searchTerm: string, searchTermCuttingWeek: number, searchTermCuttingDay: string):
  Promise<PaginatedClients | null> {
  const { orgId, userId } = await auth.protect();
  const pageSize = Number(process.env.PAGE_SIZE) || 10;
  const offset = (clientPageNumber - 1) * pageSize;

  const result = await fetchClientsWithSchedules(orgId || userId, pageSize, offset, searchTerm, searchTermCuttingWeek, searchTermCuttingDay);

  if (!result.clientsResult) return null;

  const { clients, totalPages } = processClientsResult(result.clientsResult as ClientResult[], result.totalCount, pageSize);

  return { clients, totalPages };
}


export async function FetchCuttingClients(
    clientPageNumber: number,
    searchTerm: string,
    cuttingDate: Date
): Promise<PaginatedClients | null> {
    const { orgId, userId } = await auth.protect();
    const pageSize = Number(process.env.PAGE_SIZE) || 10;
    const offset = (clientPageNumber - 1) * pageSize;

    const clientsResult = await fetchClientsCuttingSchedules(
        orgId || userId,
        pageSize,
        offset,
        searchTerm,
        cuttingDate
    );

    if (!clientsResult) return null;

    const { clients, totalPages } = processClientsResult(clientsResult as ClientResult[]);
    console.log("Data", clients, totalPages)
    return { clients, totalPages };
}