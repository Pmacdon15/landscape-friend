import { SearchParams } from "@/types/types";

export interface ParsedClientListParams {
  clientListPage: number;
  searchTerm: string;
  serviceDate: Date;
  searchTermIsServiced: boolean;
  searchTermCuttingWeek: number;
  searchTermCuttingDay: string;
  searchTermAssignedTo: string;
}

export function parseClientListParams(params: SearchParams): ParsedClientListParams {
  const clientListPage = Number(params.page ?? 1);
  const searchTerm = String(params.search ?? '');
  const serviceDate = params.date ? new Date(String(params.date)) : new Date();
  serviceDate.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC
  const searchTermIsServiced = params.serviced === 'true'; // Always return a boolean
  const searchTermCuttingWeek = Number(params.week ?? 0);
  const searchTermCuttingDay = String(params.day ?? '');
  const searchTermAssignedTo = String(params.assigned_to ?? '');

  return {
    clientListPage,
    searchTerm,
    serviceDate,
    searchTermIsServiced,
    searchTermCuttingWeek,
    searchTermCuttingDay,
    searchTermAssignedTo,
  };
}
