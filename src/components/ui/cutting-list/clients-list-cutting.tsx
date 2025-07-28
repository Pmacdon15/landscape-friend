import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
// import { isOrgAdmin } from "@/lib/webhooks";
import { Address, Client, PaginatedClients } from "@/types/types";
import { PaginationTabs } from "../pagination/pagination-tabs";
import { Button } from "../button";
import { Suspense } from "react";
import ManyPointsMap from "../map-component/many-points-map";

export default async function ClientListCutting({ clientsPromise, addressesPromise, clientListPage }:
    { clientsPromise: Promise<PaginatedClients | null>, addressesPromise: Promise<Address[] | null>, clientListPage: number }) {

    const result = await clientsPromise;

    if (!result) return <ContentContainer> <p>Error Loading clients</p> </ContentContainer>
    const { clients, totalPages, totalClients } = result;
    if (clients.length < 1) return <ContentContainer> <p>No clients scheduled for today</p> </ContentContainer>

    const addresses = await addressesPromise;
    if (addresses) console.log("Addresses: ", addresses)
    const flattenedAddresses = addresses?.map(address => address.address) ?? [];

    return (
        <>

            <ul className="flex flex-col gap-4 rounded-sm w-full items-center">
                <ContentContainer>
                    <div className="flex w-full justify-center items-center align-middle border rounded-sm p-2 gap-4 ">
                        <p className=" flex flex-shrink-0  items-center">Total Clients Left to Cut Today: {totalClients}</p>
                        {addresses &&
                            <ManyPointsMap addresses={flattenedAddresses} />
                        }
                    </div>
                </ContentContainer>
                <PaginationTabs path="/cutting-list" clientListPage={clientListPage} totalPages={totalPages} />
                {clients.map((client: Client) => (
                    <ContentContainer key={client.id}>
                        <li className="border p-4 rounded-sm relative">
                            <p>Name: {client.full_name}</p>
                            <p>Phone Number: {client.phone_number}</p>
                            <p>Email: {client.email_address}</p>
                            <p>Address: {client.address}</p>
                            <Suspense fallback={<div>Loading...</div>}>
                                <MapComponent address={client.address} />
                            </Suspense>
                        </li>
                        <Button variant="outline">Mark Grass Cut</Button>
                    </ContentContainer>
                ))}
            </ul >
            <PaginationTabs path="/cutting-list" clientListPage={clientListPage} totalPages={totalPages} />
        </>
    );
}
