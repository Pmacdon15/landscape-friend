import SearchForm from "@/components/ui/search/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import ClientListService from "../../../components/ui/service-list/clients-list-service";
import { fetchSnowClearingClients } from "@/lib/dal/clients-dal";
import { isOrgAdmin } from "@/lib/utils/clerk";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { parseClientListParams } from "@/lib/utils/params";
import { SearchParams } from "@/types/types-params";
import SearchFormFallBack from "@/components/ui/fallbacks/search/search-form-fallback";


export default async function page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const [{ isAdmin, userId }, params] = await Promise.all([
        isOrgAdmin(),
        searchParams,
    ]);

    if (!isAdmin) redirect("/")
    if (!userId) throw new Error("User ID is missing.");

    const { page, searchTerm, serviceDate, searchTermIsServiced, searchTermAssignedTo } = parseClientListParams(params);
    // const searchTermAssignedTo = String(params.assigned_to ?? userId);

    const clientsPromise = fetchSnowClearingClients(page, searchTerm, serviceDate, searchTermIsServiced, searchTermAssignedTo);

    return (
        <>
            <FormContainer>
                <FormHeader text={"Clearing List"} />
                <Suspense fallback={<SearchFormFallBack variant="clearing" />}>
                    <SearchForm variant="clearing" />
                </Suspense>
            </FormContainer>
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListService
                    clientsPromise={clientsPromise}
                    page={page}
                    serviceDate={serviceDate}
                    searchTermIsServiced={searchTermIsServiced}
                    snow={true}
                    isAdmin={isAdmin} />
            </Suspense>
        </>
    );
}