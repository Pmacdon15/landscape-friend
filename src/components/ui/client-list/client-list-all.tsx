import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import DeleteClientButton from "../buttons/delete-client-button";
import { isOrgAdmin } from "@/lib/webhooks";
import { PaginationTabs } from "../pagination/pagination-tabs";
import { CuttingWeekDropDownContainer } from "../cutting-week/cutting-week";
import { Client, PaginatedClients } from "@/types/types";
import PricePerCutUpdateInput from "./price-per-cut-update-input";
import { Suspense } from "react";
import Link from "next/link";
import { ClientEmailPopover } from "@/components/ui/popovers/client-email-popover";
import FormContainer from "../containers/form-container";
import FormHeader from "../header/form-header";
import Tabs from "../tabs-map-selector/tabs";

export default async function ClientListAll({
  clientsPromise,
  clientListPage,
  isAdmin,
}: {
  clientsPromise: Promise<PaginatedClients | null>;
  clientListPage: number;
  isAdmin: boolean;
}) {
  const result = await clientsPromise;

  if (!result)
    return (
      <ContentContainer>
        {" "}
        <p>Error Loading clients</p>{" "}
      </ContentContainer>
    );
  const { clients, totalPages } = result;

  if (clients.length < 1)
    return (
      <ContentContainer>
        {" "}
        <p>Please add clients</p>{" "}
      </ContentContainer>
    );

  return (
    <>
      <PaginationTabs
        path="/client-list"
        clientListPage={clientListPage}
        totalPages={totalPages}
      />
      <ul className="flex flex-col gap-4 rounded-sm w-full items-center">
        {clients.map((client: Client) => (
          <FormContainer key={client.id}>
            <li className="border p-4 rounded-sm relative bg-white/50">
              {isAdmin && (
                <div className="absolute top-1 right-1">
                  <DeleteClientButton clientId={client.id} />
                </div>
              )}
              <p>Name: {client.full_name}</p>
              <p className="flex flex-col sm:flex-row">
                Phone Number:{" "}
                <Link
                  className="cursor-pointer text-blue-600 hover:underline"
                  href={`tel:${client.phone_number}`}
                >
                  {client.phone_number}
                </Link>
              </p>
              <div>
                Email: <ClientEmailPopover client={client} />
              </div>
              <p>Address: {client.address}</p>
              {isAdmin && (
                <>
                  <PricePerCutUpdateInput client={client} />
                  <p>Amount owing: ${client.amount_owing} </p>
                </>
              )}
              <CuttingWeekDropDownContainer isAdmin={isAdmin} client={client} />
              <div className="flex flex-col sm:flex-row ">
                <Suspense fallback={<FormHeader text="Loading..." />}>
                  <MapComponent address={client.address} />
                </Suspense>
              <Tabs client={client} />
              </div>
            </li>
          </FormContainer>
        ))}
      </ul>
      <PaginationTabs
        path="/client-list"
        clientListPage={clientListPage}
        totalPages={totalPages}
      />
    </>
  );
}
