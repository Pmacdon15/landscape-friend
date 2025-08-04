import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import ClientListService from "@/components/ui/service-list/clients-list-service";
import { fetchAllUnServicedAddresses, fetchServiceClients } from "@/DAL/dal";
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
    const serviceDate = params.date ? new Date(String(params.date)) : new Date();
    const searchTermIsServiced = params.is_serviced === 'true';

    if (!isAdmin) redirect("/")
    const clientsPromise = fetchServiceClients(clientListPage, searchTerm, serviceDate, searchTermIsServiced);
    const addressesPromise = fetchAllUnServicedAddresses(serviceDate);

    return (
        <>
            <FormContainer>                
                    <FormHeader text={"Cutting List"} />
                    <SearchForm isServiceDayComponent={true} />               
            </FormContainer>
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListService
                    clientsPromise={clientsPromise}
                    addressesPromise={addressesPromise}
                    clientListPage={clientListPage}
                    serviceDate={serviceDate}
                    searchTermIsServiced={searchTermIsServiced} />
            </Suspense>
        </>
    );
}