import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
// import ClientListService from "@/components/ui/service-list/clients-list-service";
import FormHeader from "@/components/ui/header/form-header";
import ClientListService from "../../../components/ui/service-list/clients-list-service";
import { fetchSnowClearingClients } from "@/DAL/dal";
import { isOrgAdmin } from "@/lib/webhooks";
import { redirect } from "next/navigation";
import { Suspense } from "react";
// import { fetchOrgMembers } from "@/DAL/dal";
import { parseClientListParams } from "@/lib/params";
import { SearchParams } from "@/types/types";

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
                <SearchForm variant="clearing" />
            </FormContainer>
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListService
                    clientsPromise={clientsPromise}
                    page={page}
                    serviceDate={serviceDate}
                    searchTermIsServiced={searchTermIsServiced}
                    snow={true} />
            </Suspense>
        </>
    );
}