import { FetchAllClients } from "../../../lib/DAL/dal";
import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import { Client } from "../../../types/types";

export default async function ClientListAll() {
    const clients: Client[] = await FetchAllClients();

    if (!clients) return <ContentContainer> <p>Error Loading clients</p> </ContentContainer>
    if (clients.length < 1) return <ContentContainer> <p>Please add clients</p> </ContentContainer>

    return (
        <>
            <ul className="flex flex-col gap-4 rounded-sm w-full items-center">
                {clients.map(client => (
                    <ContentContainer key={client.id}>
                        <li className="border p-4 rounded-sm">
                            <p>Name: {client.full_name}</p>
                            <p>Email: {client.email_address}</p>
                            <p>Address: {client.address}</p>
                            <p>Maintenance Week {client.maintenance_week}</p>
                            <p>Amount owing: ${client.amount_owing} </p>
                            <MapComponent address={client.address} />
                        </li>
                    </ContentContainer>
                ))}
            </ul >
        </>
    );
}

