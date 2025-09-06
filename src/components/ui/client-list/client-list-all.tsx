import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import DeleteClientButton from "../buttons/delete-client-button";
import { PaginationTabs } from "../pagination/pagination-tabs";
import { CuttingWeekDropDownContainer } from "../cutting-week/cutting-week";
import { Suspense } from "react";
import FormContainer from "../containers/form-container";
import FormHeader from "../header/form-header";
import PricePerUpdateInput from "./price-per-update-input";
import ImageList from "../image-list/image-list";
import { ClientListServiceProps } from "@/types/clients-types";
import { ClientListItemEmail, ClientListItemHeader } from "./client-list-item";
import ClientListItemAddress from "./client-list-item-address";
import AssignedTo from "../inputs/AssignedToSelect";
import AssignedToFallback from "../fallbacks/assigned-to-fallback";
import { ViewSitePhotoSheet } from "../sheet/view-site-phots-sheet";

export default async function ClientListService({
  clientsPromise,
  page,
  orgMembersPromise,
  isAdmin,
}: ClientListServiceProps) {
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
        path="/lists/client"
        page={page}
        totalPages={totalPages}
      />
      <ul className="flex flex-col gap-4 rounded-sm w-full items-center justify-center">
        {clients.map((client) => (
          <FormContainer key={client.id}>
            <li className="border p-4 rounded-sm relative bg-white/70">
              {isAdmin && <DeleteClientButton clientId={client.id} />}
              <FormHeader text={client.full_name} />
              <div className="flex flex-col gap-2 items-center justify-center mt-8 mb-8 lg:flex-row w-full">
                <ClientListItemHeader client={client} />
                <ClientListItemEmail client={client} />
                <ClientListItemAddress client={client} >
                  <MapComponent address={client.address} />
                </ClientListItemAddress>
              </div>
              {isAdmin &&
                <div className="flex flex-col gap-2 md:flex-row items-center flex-wrap justify-center">
                  <p>Amount owing: ${client.amount_owing} </p>
                  <PricePerUpdateInput client={client} />
                  <PricePerUpdateInput client={client} snow={true} />
                  <Suspense fallback={<AssignedToFallback />}>
                    <AssignedTo client={client} orgMembersPromise={orgMembersPromise} />
                  </Suspense>
                  <Suspense fallback={<AssignedToFallback />}>
                    <AssignedTo client={client} orgMembersPromise={orgMembersPromise} snow />
                  </Suspense>
                </div>
              }
              <CuttingWeekDropDownContainer isAdmin={isAdmin} client={client} />
              <ViewSitePhotoSheet client={client}/>
              <ImageList isAdmin={isAdmin} client={client} />
              {/* <ListServices client={client} /> */}              
            </li>
          </FormContainer>
        ))}
      </ul>
      <PaginationTabs
        path="/lists/client"
        page={page}
        totalPages={totalPages}
      />
    </>
  );
}
