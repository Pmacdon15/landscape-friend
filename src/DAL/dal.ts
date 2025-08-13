import { fetchClientsWithSchedules, fetchClientsCuttingSchedules, fetchClientNamesAndEmailsDb, fetchStripAPIKeyDb, fetchClientsClearingGroupsDb } from "@/lib/db";
import { processClientsResult } from "@/lib/sort";
import { isOrgAdmin } from "@/lib/webhooks";
import { ClientResult, NamesAndEmails, PaginatedClients, APIKey, OrgMember, StripeInvoice } from "@/types/types";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

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
  clearingDate: Date,
  searchTermIsServiced: boolean,
  searchTermAssignedTo: string
): Promise<PaginatedClients | null> {
  const { orgId, userId, isAdmin } = await isOrgAdmin()

  if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");
  if (!isAdmin && userId !== searchTermAssignedTo) throw new Error("Not admin can not view other coworkers list")

  const pageSize = Number(process.env.PAGE_SIZE) || 10;
  const offset = (clientPageNumber - 1) * pageSize;

  const result = await fetchClientsClearingGroupsDb(
    (orgId || userId)!,
    pageSize,
    offset,
    searchTerm,
    clearingDate,
    searchTermIsServiced,
    searchTermAssignedTo
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

// export async function fetchAllUnCutAddresses(searchTermCuttingDate: Date): Promise<Address[] | null | Error> {
//   const { orgId, userId } = await auth.protect();

//   try {
//     const result = await FetchAllUnCutAddressesDB(orgId || userId, searchTermCuttingDate);

//     if (!result) return null;
//     return result;
//   } catch (e) {
//     if (e instanceof Error)
//       return e; // Return the error directly
//     else
//       return new Error('An unknown error occurred'); // Return a generic error
//   }
// }

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
let stripe: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY; // Or fetch from DB
    if (!apiKey) {
      throw new Error('Stripe secret key not configured.');
    }
    stripe = new Stripe(apiKey);
  }
  return stripe;
}

//MARK: Fetch invoices
export async function fetchOpenInvoices(): Promise<StripeInvoice[]> {
  const { isAdmin } = await isOrgAdmin()
  if (!isAdmin) throw new Error("Not Admin")
  const stripe = getStripeInstance();
  try {
    const invoices = await stripe.invoices.list({
      status: 'open',
    });

    const validInvoices = invoices.data.filter(
      (invoice): invoice is Stripe.Invoice & { id: string } => !!invoice.id
    );

    const strippedInvoices = validInvoices.map((invoice) => ({
      id: invoice.id,
      object: invoice.object,
      amount_due: invoice.amount_due,
      amount_paid: invoice.amount_paid,
      amount_remaining: invoice.amount_remaining,
      created: invoice.created,
      currency: invoice.currency,
      customer: invoice.customer,
      customer_email: invoice.customer_email,
      customer_name: invoice.customer_name,
      due_date: invoice.due_date,
      hosted_invoice_url: invoice.hosted_invoice_url,
      invoice_pdf: invoice.invoice_pdf,
      number: invoice.number,
      status: invoice.status,
      total: invoice.total,
      lines: {
        data: invoice.lines.data.map((lineItem) => ({
          // Assuming you have a StripeLineItem interface defined
          id: lineItem.id,
          // Add other properties you need from lineItem
        })),
      },
    }));

    return strippedInvoices as StripeInvoice[];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch invoices');
  }
}