import { fetchClientsWithSchedules, fetchClientsCuttingSchedules } from "@/lib/db";
import { processClientsResult } from "@/lib/sort";
import { ClientResult, PaginatedClients } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export async function FetchAllClients(clientPageNumber: number, searchTerm: string, searchTermCuttingWeek: number, searchTermCuttingDay: string):
    Promise<PaginatedClients | null> {
    const { orgId, userId } = await auth.protect();
    const pageSize = Number(process.env.PAGE_SIZE) || 10;
    const offset = (clientPageNumber - 1) * pageSize;

    const clientsResult = await fetchClientsWithSchedules(orgId || userId, pageSize, offset, searchTerm, searchTermCuttingWeek, searchTermCuttingDay);

    if (!clientsResult) return null;

    const { clients, totalPages } = processClientsResult(clientsResult as ClientResult[]);

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

  return { clients, totalPages };
}