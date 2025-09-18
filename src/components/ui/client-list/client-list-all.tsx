import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import DeleteClientButton from "../buttons/delete-client-button";
import { PaginationTabs } from "../pagination/pagination-tabs";
import { CuttingWeekDropDownContainer } from "../cutting-week/cutting-week";
import { Suspense } from "react";
import FormContainer from "../containers/form-container";
import FormHeader from "../header/form-header";
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
                <ClientListItemHeader clientPhoneNumber={client.phone_number} />
                <ClientListItemEmail clientEmailAddress={client.email_address} clientFullName={client.full_name} />
                <ClientListItemAddress clientId={client.id} clientAddress={client.address} >
                  <MapComponent address={client.address} />
                </ClientListItemAddress>
              </div>
              {isAdmin &&
                <div className="flex flex-col gap-2 md:flex-row items-center flex-wrap justify-center">
                  <p>Amount owing: ${client.amount_owing} </p>
                  <Suspense fallback={<AssignedToFallback />}>
                    <AssignedTo orgMembersPromise={orgMembersPromise}
                      clientAssignedTo={client.grass_assigned_to || 'not-assigned'}
                      clientId={client.id}
                    />
                  </Suspense>
                  <Suspense fallback={<AssignedToFallback />}>
                    <AssignedTo orgMembersPromise={orgMembersPromise}
                      clientAssignedTo={client.snow_assigned_to || 'not-assigned'}
                      clientId={client.id}
                      snow
                    />
                  </Suspense>
                </div>
              }
              <CuttingWeekDropDownContainer
                isAdmin={isAdmin}
                client={{
                  id: client.id,
                  cutting_schedules: client.cutting_schedules,
                }}
              />
              <ViewSitePhotoSheet clientId={client.id} />
              <ImageList isAdmin={isAdmin} client={client} />
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
