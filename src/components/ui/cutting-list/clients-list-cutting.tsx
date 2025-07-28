import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import { Address, Client, PaginatedClients } from "@/types/types";
import { PaginationTabs } from "../pagination/pagination-tabs";
import { Suspense } from "react";
import ManyPointsMap from "../map-component/many-points-map";
import Link from "next/link";
import MarkYardCut from "../buttons/mark-yard-cut";

export default async function ClientListCutting({ clientsPromise, addressesPromise, clientListPage, cuttingDate, searchTermIsCut }:
    {
        clientsPromise: Promise<PaginatedClients | null>,
        addressesPromise: Promise<Address[] | null | Error>,
        clientListPage: number, cuttingDate: Date,
        searchTermIsCut: boolean
    }) {

    const result = await clientsPromise;

    if (!result) return <ContentContainer> <p className="text-red-500">Error Loading clients</p> </ContentContainer>
    const { clients, totalPages } = result;
    if (clients.length < 1) return <ContentContainer> <p>No clients scheduled for today</p> </ContentContainer>

    const addresses = await addressesPromise;
    if (addresses instanceof Error) return <ContentContainer><p className="text-red-500">{addresses.message}</p></ContentContainer>

    const flattenedAddresses = addresses?.map(address => address.address) ?? [];

    return (
        <>

            <ul className="flex flex-col gap-2 md:gap-4 rounded-sm w-full items-center">
                {addresses && addresses?.length > 0 &&
                    <ContentContainer>
                        <div className="flex flex-col md:flex-row w-full justify-center items-center align-middle border rounded-sm p-2 gap-4 ">
                            <p className=" flex flex-shrink-0  items-center">Total Clients Left to Cut Today: {flattenedAddresses.length}</p>
                            <ManyPointsMap addresses={flattenedAddresses} />
                        </div>
                    </ContentContainer>}
                <PaginationTabs path="/cutting-list" clientListPage={clientListPage} totalPages={totalPages} />

                {clients.map((client: Client) => (
                    <ContentContainer key={client.id}>
                        <li className="border p-4 rounded-sm relative">
                            <p>Name: {client.full_name}</p>
                            <p>
                                Phone Number:{" "}
                                <Link href={`tel:${client.phone_number}`}>
                                    {client.phone_number}
                                </Link>
                            </p>
                            <p>
                                Email:{" "}
                                <Link href={`mailto:${client.email_address}`}>
                                    {client.email_address}
                                </Link>
                            </p>
                            <p>Address: {client.address}</p>
                            <Suspense fallback={<div>Loading...</div>}>
                                <MapComponent address={client.address} />
                            </Suspense>
                        </li>
                        {!searchTermIsCut && <MarkYardCut clientId={client.id} cuttingDate={cuttingDate} />}
                    </ContentContainer>
                ))}
            </ul >
            <PaginationTabs path="/cutting-list" clientListPage={clientListPage} totalPages={totalPages} />
        </>
    );
}
