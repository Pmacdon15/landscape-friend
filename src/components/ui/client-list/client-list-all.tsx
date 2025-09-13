"use client"; // enables useState and client-side interactivity

import { useState, Suspense } from "react";
import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import DeleteClientButton from "../buttons/delete-client-button";
import { PaginationTabs } from "../pagination/pagination-tabs";
import { CuttingWeekDropDownContainer } from "../cutting-week/cutting-week";
import FormContainer from "../containers/form-container";
import FormHeader from "../header/form-header";
import ImageList from "../image-list/image-list";
import { ClientListServiceProps } from "@/types/clients-types";
import { ClientListItemEmail, ClientListItemHeader } from "./client-list-item";
import ClientListItemAddress from "./client-list-item-address";
import AssignedTo from "../inputs/AssignedToSelect";
import AssignedToFallback from "../fallbacks/assigned-to-fallback";

export default function ClientListService({
  clientsPromise,
  page,
  orgMembersPromise,
  isAdmin
}: ClientListServiceProps) {
  const [searchAssigned, setSearchAssigned] = useState("");

  // -----------------------------
  // Step 0: Get clients from promise
  // -----------------------------
  const [clientsResult, setClientsResult] = useState<{ clients: any[], totalPages: number }>({ clients: [], totalPages: 1 });

  // Handle clientsPromise in useEffect
  React.useEffect(() => {
    clientsPromise.then(result => {
      if (result) setClientsResult(result);
    });
  }, [clientsPromise]);

  const { clients, totalPages } = clientsResult;

  if (!clients || clients.length < 1) return <ContentContainer><p>No clients available</p></ContentContainer>;

  // -----------------------------
  // Step 1: Filter clients by assignedTo (both snow and grass)
  // -----------------------------
  const filteredClients = clients.filter((client) => {
    const assignedNormal = client.assignedTo || "";
    const assignedSnow = client.assignedToSnow || "";
    const search = searchAssigned.toLowerCase();
    return (
      assignedNormal.toLowerCase().includes(search) ||
      assignedSnow.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <PaginationTabs path="/lists/client" page={page} totalPages={totalPages} />

      {/* Assigned To search */}
      <div className="mb-4 w-full max-w-md mx-auto">
        <label htmlFor="assignedSearch" className="block font-semibold mb-1">
          Search by Assigned To
        </label>
        <input
          id="assignedSearch"
          type="text"
          placeholder="Type assigned person's name..."
          value={searchAssigned}
          onChange={(e) => setSearchAssigned(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <ul className="flex flex-col gap-4 rounded-sm w-full items-center justify-center">
        {filteredClients.map((client) => (
          <FormContainer key={client.id}>
            <li className="border p-4 rounded-sm relative bg-white/70">
              {isAdmin && <DeleteClientButton clientId={client.id} />}
              <FormHeader text={client.full_name} />
              <div className="flex flex-col gap-2 items-center justify-center mt-8 mb-8 lg:flex-row w-full">
                <ClientListItemHeader client={client} />
                <ClientListItemEmail client={client} />
                <ClientListItemAddress client={client}>
                  <MapComponent address={client.address} />
                </ClientListItemAddress>
              </div>
              {isAdmin && (
                <div className="flex flex-col gap-2 md:flex-row items-center flex-wrap justify-center">
                  <p>Amount owing: ${client.amount_owing}</p>
                  <Suspense fallback={<AssignedToFallback />}>
                    <AssignedTo client={client} orgMembersPromise={orgMembersPromise} />
                  </Suspense>
                  <Suspense fallback={<AssignedToFallback />}>
                    <AssignedTo client={client} orgMembersPromise={orgMembersPromise} snow />
                  </Suspense>
                </div>
              )}
              <CuttingWeekDropDownContainer isAdmin={isAdmin} client={client} />
              <ImageList isAdmin={isAdmin} client={client} />
            </li>
          </FormContainer>
        ))}
      </ul>

      <PaginationTabs path="/lists/client" page={page} totalPages={totalPages} />
    </>
  );
}
