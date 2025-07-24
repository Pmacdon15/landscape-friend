import AddClientFormClientComponent from "@/components/ui/client-list/add-client-form-client-component";
import { AddClientFormServerComponent } from "@/components/ui/client-list/add-client-form-server-component";
import ClientListAll from "@/components/ui/client-list/client-list-all";
import ContentContainer from "@/components/ui/containers/content-container";
import { FetchAllClients } from "@/DAL/dal";
import { isOrgAdmin } from "@/lib/functions";
import { Suspense } from "react";

export default async function page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const clientListPage = params.clientListPage
    const { isAdmin } = await isOrgAdmin()
    const clientsPromise = FetchAllClients();
    return (
        <>
            <ContentContainer>
                <h1 className="text-2xl">Client List</h1>
            </ContentContainer>
            {isAdmin &&
                <AddClientFormClientComponent>
                    <AddClientFormServerComponent />
                </AddClientFormClientComponent>
            }
            <Suspense fallback={<ContentContainer>Loading...</ContentContainer>}>
                <ClientListAll clientsPromise={clientsPromise} clientListPage={Number(clientListPage)} />
            </Suspense>
        </>
    );
}