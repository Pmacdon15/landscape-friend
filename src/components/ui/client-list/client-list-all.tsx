import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import DeleteClientButton from "../buttons/delete-client-button";
import { isOrgAdmin } from "@/lib/functions";
import { PaginationTabs } from "../pagination/pagination-tabs";
import { PaginatedClients } from "@/DAL/dal";

export default async function ClientListAll({ clientsPromise, clientListPage }: { clientsPromise: Promise<PaginatedClients | null>, clientListPage: number }) {

  const { isAdmin } = await isOrgAdmin()
  const result = await clientsPromise;
  
  if (!result) return <ContentContainer> <p>Error Loading clients</p> </ContentContainer>
  const { clients, totalPages } = result;

  if (clients.length < 1) return <ContentContainer> <p>Please add clients</p> </ContentContainer>

  return (
    <>
      <PaginationTabs clientListPage={clientListPage} totalPages={totalPages} />
      <ul className="flex flex-col gap-4 rounded-sm w-full items-center">
        {clients.map(client => (
          <ContentContainer key={client.id}>
            <li className="border p-4 rounded-sm relative">
              {isAdmin &&
                <div className="absolute top-1 right-1">
                  <DeleteClientButton clientId={client.id} />
                </div>
              }
              <p>Name: {client.full_name}</p>
              <p>Phone Number: {client.phone_number}</p>
              <p>Email: {client.email_address}</p>
              <p>Address: {client.address}</p>
              <p>Maintenance Week {client.maintenance_week}</p>
              <p>Amount owing: ${client.amount_owing} </p>
              <MapComponent address={client.address} />
            </li>
          </ContentContainer>
        ))}
      </ul >
      <PaginationTabs clientListPage={clientListPage} totalPages={totalPages} />
    </>
  );
}