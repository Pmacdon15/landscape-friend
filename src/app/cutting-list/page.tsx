import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import HeaderWithSearch from "@/components/ui/containers/header-with-search";
import ClientListCutting from "@/components/ui/cutting-list/clients-list-cutting";
import FormHeader from "@/components/ui/header/form-header";
import { FetchAllUnCutAddresses, FetchCuttingClients } from "@/DAL/dal";
import { isOrgAdmin } from "@/lib/webhooks";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | number | undefined }>;
}) {
    const params = await searchParams;
    const clientListPage = Number(params.page ?? 1);
    const searchTerm = String(params.search ?? '');
    const cuttingDate = params.date ? new Date(String(params.date)) : new Date();
    const searchTermIsCut = params.is_cut === 'true';

    const { isAdmin } = await isOrgAdmin();
    if (!isAdmin) redirect("/")
    const clientsPromise = FetchCuttingClients(clientListPage, searchTerm, cuttingDate, searchTermIsCut);
    const addressesPromise = FetchAllUnCutAddresses(cuttingDate);

    return (
        <>
            <FormContainer>
                <HeaderWithSearch>
                    <FormHeader text={"Cutting List"} />
                    <SearchForm isCuttingDayComponent={true} />
                </ HeaderWithSearch>
            </FormContainer>
            <Suspense fallback={<FormContainer><FormHeader text="Loading..." /></FormContainer>}>
                <ClientListCutting
                    clientsPromise={clientsPromise}
                    addressesPromise={addressesPromise}
                    clientListPage={clientListPage}
                    cuttingDate={cuttingDate}
                    searchTermIsCut={searchTermIsCut} />
            </Suspense>
        </>
    );
}