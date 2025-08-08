import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import DeleteClientButton from "../buttons/delete-client-button";
import { PaginationTabs } from "../pagination/pagination-tabs";
import { CuttingWeekDropDownContainer } from "../cutting-week/cutting-week";
import { Client, ClientListServiceProps } from "@/types/types";
import { Suspense } from "react";
import Link from "next/link";
import { ClientEmailPopover } from '@/components/ui/popovers/client-email-popover'
import FormContainer from "../containers/form-container";
import FormHeader from "../header/form-header";
import SnowClientInput from "../inputs/snow-client-input";
import SnowClientInputFallback from "../fallbacks/snow-client-input-fallback";
import PricePerUpdateInput from "./price-per-cut-update-input";


export default async function ClientListService({
  clientsPromise,
  clientListPage,  
  orgMembersPromise,
  isAdmin
}: ClientListServiceProps) {

  const result = await clientsPromise;

  if (!result) return <ContentContainer> <p>Error Loading clients</p> </ContentContainer>
  const { clients, totalPages } = result;

  if (clients.length < 1) return <ContentContainer> <p>Please add clients</p> </ContentContainer>

  return (
    <>
      <PaginationTabs path="/lists/client" clientListPage={clientListPage} totalPages={totalPages} />
      <ul className="flex flex-col gap-4 rounded-sm w-full items-center">
        {clients.map((client: Client) => (
          <FormContainer key={client.id}>
            <li className="border p-4 rounded-sm relative bg-white/50">
              {isAdmin &&
                <div className="absolute top-1 right-1">
                  <DeleteClientButton clientId={client.id} />
                </div>}
              <p>Name: {client.full_name}</p>
              <p className="flex flex-col sm:flex-row">
                Phone Number:{" "}
                <Link className="cursor-pointer text-blue-600 hover:underline" href={`tel:${client.phone_number}`}>
                  {client.phone_number}
                </Link>
              </p>
              <div>
                Email:{" "}
                <ClientEmailPopover client={client} />
              </div>
              <p>Address: {client.address}</p>
              {isAdmin &&
                <>
                  <Suspense fallback={<SnowClientInputFallback />}>
                    <SnowClientInput client={client} orgMembersPromise={orgMembersPromise} />
                  </Suspense>
                  <PricePerUpdateInput client={client} />
                  <p>Amount owing: ${client.amount_owing} </p>
                </>
              }
              <CuttingWeekDropDownContainer isAdmin={isAdmin} client={client} />
              <Suspense fallback={<FormHeader text="Loading..." />}>
                <MapComponent address={client.address} />
              </Suspense>
            </li>
          </FormContainer>
        ))}
      </ul >
      <PaginationTabs path="/lists/client" clientListPage={clientListPage} totalPages={totalPages} />
    </>
  );
}