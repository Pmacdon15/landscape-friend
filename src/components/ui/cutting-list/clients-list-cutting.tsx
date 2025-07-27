import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import { isOrgAdmin } from "@/lib/webhooks";
import { Client, PaginatedClients } from "@/types/types";
import { PaginationTabs } from "../pagination/pagination-tabs";

export default async function ClientListCutting({ clientsPromise, clientListPage, searchTerm, date }:
    { clientsPromise: Promise<PaginatedClients | null>, clientListPage: number, searchTerm: string, date?: Date }) {
    const { isAdmin } = await isOrgAdmin()
    const result = await clientsPromise;

    if (!result) return <ContentContainer> <p>Error Loading clients</p> </ContentContainer>
    const { clients, totalPages } = result;
    if (clients.length < 1) return <ContentContainer> <p>No clients scheduled for today</p> </ContentContainer>

    return (
        <>
            <PaginationTabs path="/cutting-list" clientListPage={clientListPage} totalPages={totalPages} />
            <ul className="flex flex-col gap-4 rounded-sm w-full items-center">
                {clients.map((client: Client) => (
                    <ContentContainer key={client.id}>
                        <li className="border p-4 rounded-sm relative">
                            <p>Name: {client.full_name}</p>
                            <p>Phone Number: {client.phone_number}</p>
                            <p>Email: {client.email_address}</p>
                            <p>Address: {client.address}</p>                           
                            <MapComponent address={client.address} />
                        </li>
                    </ContentContainer>
                ))}
            </ul >           
            <PaginationTabs path="/cutting-list" clientListPage={clientListPage} totalPages={totalPages} />
        </>
    );
}
