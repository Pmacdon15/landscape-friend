import { Suspense } from "react";
import { FetchAllClients } from "../../../DAL/dal";
import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import { Client } from "../../../types/types";

export default async function ClientListAll() {
    const clients: Client[] = await FetchAllClients();
    return (
        <Suspense fallback={<ContentContainer>Loading...</ContentContainer>}>
            <ul className="flex flex-col gap-4 rounded-sm w-full items-center">
                {clients.map(client => (
                    <ContentContainer key={client.id}>
                        <li className="border p-4 rounded-sm">
                            <p>Name: {client.fullname}</p>
                            <p>Email: {client.emailaddress}</p>
                            <p>Address: {client.address}</p>
                            <p>Maintenance Week{client.maintenanceweek}</p>
                            <p>Amount owing: ${client.amountowing} </p>
                            <MapComponent address={client.address} />
                        </li>
                    </ContentContainer>
                ))}
            </ul >
        </Suspense >
    );
}