import AddClientFormClientComponent from "@/components/ui/client-list/add-client-form-client-component";
import { AddClientFormServerComponent } from "@/components/ui/client-list/add-client-form-server-component";
import ClientListAll from "@/components/ui/client-list/client-list-all";
import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import HeaderWithSearch from "@/components/ui/containers/header-with-search";
import FormHeader from "@/components/ui/header/form-header";
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
            <FormContainer>
                <HeaderWithSearch>
                    <FormHeader text={"Client List"} />
                    <SearchForm />
                </HeaderWithSearch>
            </FormContainer>
            {isAdmin &&
                <AddClientFormClientComponent>
                    <AddClientFormServerComponent />
                </AddClientFormClientComponent>
            }
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListAll clientsPromise={clientsPromise} clientListPage={clientListPage} />
            </Suspense>
        </>
    );
}