import SearchForm from "@/components/ui/client-list/search-form";
import ContentContainer from "@/components/ui/containers/content-container";
import HeaderWithSearch from "@/components/ui/containers/header-with-search";
import ClientListCutting from "@/components/ui/cutting-list/clients-list-cutting";
import { FetchCuttingClients } from "@/DAL/dal";
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

    const { isAdmin } = await isOrgAdmin();
    if (!isAdmin) redirect("/")
    const clientsPromise = FetchCuttingClients(clientListPage, searchTerm, cuttingDate);

    return (
        <>
            <ContentContainer>
                <HeaderWithSearch>
                    <h1 className="text-2xl">Client Cutting List</h1>
                    <SearchForm isCuttingDayComponent={true} />
                </ HeaderWithSearch>
            </ContentContainer>
            <Suspense fallback={<ContentContainer>Loading...</ContentContainer>}>
                <ClientListCutting clientsPromise={clientsPromise} clientListPage={clientListPage} />
            </Suspense>
        </>
    );
}