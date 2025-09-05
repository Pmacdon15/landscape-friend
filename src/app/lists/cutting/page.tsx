import SearchForm from "@/components/ui/search/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { fetchCuttingClients } from "@/lib/dal/clients-dal";
import { isOrgAdmin } from "@/lib/utils/clerk";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ClientListService from "../../../components/ui/service-list/clients-list-service";
import { parseClientListParams } from "@/lib/utils/params";
import { SearchParams } from "@/types/params-types";
import SearchFormFallBack from "@/components/ui/fallbacks/search/search-form-fallback";

export default async function page({ searchParams }: { searchParams: Promise<SearchParams>; }) {
    const [{ isAdmin }, params] = await Promise.all([
        isOrgAdmin(),
        searchParams,
    ]);

    const { page, searchTerm, serviceDate, searchTermIsServiced } = parseClientListParams(params);

    if (!isAdmin) redirect("/")

    const clientsPromise = serviceDate ? fetchCuttingClients(page, searchTerm, serviceDate, searchTermIsServiced) : Promise.resolve(null);

    return (
        <>
            <FormContainer>
                <FormHeader text={"Cutting List"} />
                <Suspense fallback={<SearchFormFallBack variant="cutting" />}>
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