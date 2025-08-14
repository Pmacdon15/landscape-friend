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
    const [{ isAdmin, userId }, params] = await Promise.all([
        isOrgAdmin(),
        searchParams,
    ]);

    if (!isAdmin) redirect("/")
    if (!userId) throw new Error("User ID is missing.");

    const clientListPage = Number(params.page ?? 1);
    const searchTerm = String(params.search ?? '');
    const searchTermIsServiced = params.serviced === 'true';
    const searchTermAssignedTo = String(params.assigned_to ?? userId);
    const serviceDate = params.date ? new Date(String(params.date)) : new Date();

    const clientsPromise = fetchSnowClearingClients(clientListPage, searchTerm, serviceDate, searchTermIsServiced, searchTermAssignedTo);

    return (
        <>
            <FormContainer>
                <FormHeader text={"Clearing List"} />
                <SearchForm variant="service" />
            </FormContainer>
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListService
                    clientsPromise={clientsPromise}
                    clientListPage={clientListPage}
                    serviceDate={serviceDate}
                    searchTermIsServiced={searchTermIsServiced}
                    snow={true} />
            </Suspense>
        </>
    );
}