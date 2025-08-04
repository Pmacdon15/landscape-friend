import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import ClientListCutting from "@/components/ui/service-list/clients-list-service";
import FormHeader from "@/components/ui/header/form-header";
import { fetchAllUnCutAddresses, fetchCuttingClients } from "@/DAL/dal";
import { isOrgAdmin } from "@/lib/webhooks";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | number | undefined }>;
}) {
    const [{ isAdmin }, params] = await Promise.all([
        isOrgAdmin(),
        searchParams,
    ]);

    const clientListPage = Number(params.page ?? 1);
    const searchTerm = String(params.search ?? '');
    const cuttingDate = params.date ? new Date(String(params.date)) : new Date();
    const searchTermIsCut = params.is_cut === 'true';

    if (!isAdmin) redirect("/")
    const clientsPromise = fetchCuttingClients(clientListPage, searchTerm, cuttingDate, searchTermIsCut);
    const addressesPromise = fetchAllUnCutAddresses(cuttingDate);

    return (
        <>
            <FormContainer>
                <FormHeader text={"Cutting List"} />
                <SearchForm isCuttingDayComponent={true} />
            </FormContainer>
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListCutting
                    clientsPromise={clientsPromise}
                    addressesPromise={addressesPromise}
                    clientListPage={clientListPage}
                    cuttingDate={cuttingDate}
                    searchTermIsServiced={searchTermIsCut} />
            </Suspense>
        </>
    );
}