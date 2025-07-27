import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import { isOrgAdmin } from "@/lib/webhooks";

import { CuttingWeekDropDownContainer } from "@/components/ui/cutting-week/cutting-week"
import { Client, PaginatedClients } from "@/types/types";
// import PricePerCutUpdateInput from "./price-per-cut-update-input";
// import DeleteClientButton from "../buttons/delete-client-button";
// import { PaginationTabs } from "../pagination/pagination-tabs";

// export default async function ClientListCutting({ clientsPromise, clientListPage }:
//     { clientsPromise: Promise<PaginatedClients | null>, clientListPage: number }) {
export default async function ClientListCutting() {
    const { isAdmin } = await isOrgAdmin()
    //   const result = await clientsPromise;

    //   if (!result) return <ContentContainer> <p>Error Loading clients</p> </ContentContainer>
    //   const { clients, totalPages } = result;  

    //   if (clients.length < 1) return <ContentContainer> <p>Please add clients</p> </ContentContainer>

    return (
        <>
            {/* <PaginationTabs clientListPage={clientListPage} totalPages={totalPages} /> */}
            {/* <ul className="flex flex-col gap-4 rounded-sm w-full items-center">
                {clients.map((client: Client) => (
                    <ContentContainer key={client.id}>
                        <li className="border p-4 rounded-sm relative">
                            <p>Name: {client.full_name}</p>
                            <p>Phone Number: {client.phone_number}</p>
                            <p>Email: {client.email_address}</p>
                            <p>Address: {client.address}</p>
                            <CuttingWeekDropDownContainer isAdmin={false} client={client} />
                            <MapComponent address={client.address} />
                        </li>
                    </ContentContainer>
                ))}
            </ul > */}
            hey
            {/* <PaginationTabs clientListPage={clientListPage} totalPages={totalPages} /> */}
        </>
    );
}
