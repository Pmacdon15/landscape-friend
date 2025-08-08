import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
// import ClientListService from "@/components/ui/service-list/clients-list-service";
import FormHeader from "@/components/ui/header/form-header";
import ClientListService from "@/components/ui/service-list/clients-list-service";
import { fetchSnowClearingClients } from "@/DAL/dal";
import { isOrgAdmin } from "@/lib/webhooks";
import { redirect } from "next/navigation";
import { Suspense } from "react";
// import { fetchOrgMembers } from "@/DAL/dal";

export default async function page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | number | undefined }>;
}) {
    const [{ isAdmin }, params] = await Promise.all([
        isOrgAdmin(),
        searchParams,
    ]);
    console.log(params)
    if (!isAdmin) redirect("/")

    const clientListPage = Number(params.page ?? 1);
    const searchTerm = String(params.search ?? '');
    const searchTermIsServiced = params.is_serviced === 'true';
    const searchTermAssignedTo = String(params.assigned_to ?? "");
    const clearingDate = new Date();

    const clientsPromise = fetchSnowClearingClients(clientListPage, searchTerm, clearingDate, searchTermIsServiced, searchTermAssignedTo);
    const addressesPromise = Promise.resolve([]);
    // const orgMembersPromise = fetchOrgMembers();
    return (
        <>
            <FormContainer>
                <FormHeader text={"Clearing List"} />
                <SearchForm isCuttingDayComponent={true} snow={true} />
            </FormContainer>
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListService
                    clientsPromise={clientsPromise}
                    addressesPromise={addressesPromise}
                    clientListPage={clientListPage}
                    searchTermIsServiced={searchTermIsServiced}
                    snow={true}
                />
            </Suspense>
        </>
    );
}