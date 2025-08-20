import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { fetchCuttingClients } from "@/DAL/dal-clients";
import { isOrgAdmin } from "@/lib/clerk";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ClientListService from "../../../components/ui/service-list/clients-list-service";
import { parseClientListParams } from "@/lib/params";
import { SearchParams } from "@/types/types-params";

export default async function page({ searchParams }: { searchParams: Promise<SearchParams>; }) {
    const [{ isAdmin }, params] = await Promise.all([
        isOrgAdmin(),
        searchParams,
    ]);

    const { page, searchTerm, serviceDate, searchTermIsServiced } = parseClientListParams(params);

    if (!isAdmin) redirect("/")
    const clientsPromise = fetchCuttingClients(page, searchTerm, serviceDate, searchTermIsServiced);

    return (
        <>
            <FormContainer>
                <FormHeader text={"Cutting List"} />
                <Suspense>
                    <SearchForm variant="cutting" />
                </Suspense>
            </FormContainer>
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListService
                    clientsPromise={clientsPromise}
                    page={page}
                    serviceDate={serviceDate}
                    searchTermIsServiced={searchTermIsServiced}
                    isAdmin={isAdmin} />
            </Suspense>
        </>
    );
}