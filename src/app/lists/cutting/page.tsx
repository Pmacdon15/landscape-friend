import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import {  fetchCuttingClients } from "@/DAL/dal";
import { isOrgAdmin } from "@/lib/webhooks";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ClientListService from "@/components/ui/service-list/clients-list-service";

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
    const searchTermIsServiced = params.serviced === 'true';

    if (!isAdmin) redirect("/")
    const clientsPromise = fetchCuttingClients(clientListPage, searchTerm, serviceDate, searchTermIsServiced);

    return (
        <>
            <FormContainer>
                <FormHeader text={"Cutting List"} />
                <SearchForm variant="service" />
            </FormContainer>
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListService
                    clientsPromise={clientsPromise}
                    clientListPage={clientListPage}
                    serviceDate={serviceDate}
                    searchTermIsServiced={searchTermIsServiced} />
            </Suspense>
        </>
    );
}