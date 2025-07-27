import AddClientFormClientComponent from "@/components/ui/client-list/add-client-form-client-component";
import { AddClientFormServerComponent } from "@/components/ui/client-list/add-client-form-server-component";
import ClientListAll from "@/components/ui/client-list/client-list-all";
import SearchForm from "@/components/ui/client-list/search-form";
import ContentContainer from "@/components/ui/containers/content-container";
import HeaderWithSearch from "@/components/ui/containers/header-with-search";
import { FetchAllClients } from "@/DAL/dal";
import { isOrgAdmin } from "@/lib/webhooks";
import { Suspense } from "react";

export default async function page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | number | undefined }>
}) {
    const params = await searchParams;
    const clientListPage = Number(params.page ?? 1);
    const searchTerm = String(params.search ?? '');
    const searchTermCuttingWeek = Number(params.week ?? 0);
    const searchTermCuttingDay = String(params.day ?? '');

    const { isAdmin } = await isOrgAdmin()
    const clientsPromise = FetchAllClients(clientListPage, searchTerm, searchTermCuttingWeek, searchTermCuttingDay);
    return (
        <>
            <ContentContainer>
                <HeaderWithSearch>
                    <h1 className="flex text-2xl flex-shrink-0 items-center">Client List</h1>
                    <SearchForm />
                </HeaderWithSearch>
            </ContentContainer>
            {isAdmin &&
                <AddClientFormClientComponent>
                    <AddClientFormServerComponent />
                </AddClientFormClientComponent>
            }
            <Suspense fallback={<ContentContainer>Loading...</ContentContainer>}>
                <ClientListAll clientsPromise={clientsPromise} clientListPage={clientListPage} />
            </Suspense>
        </>
    );
}