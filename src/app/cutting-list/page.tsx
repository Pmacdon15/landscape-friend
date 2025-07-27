import SearchForm from "@/components/ui/client-list/search-form";
import ContentContainer from "@/components/ui/containers/content-container";
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
    const cuttingDate = new Date(String(params.date))

    const { isAdmin } = await isOrgAdmin();
    if (!isAdmin) redirect("/")
    const clientsPromise = FetchCuttingClients(clientListPage, searchTerm, cuttingDate);

    return (
        <>
            <ContentContainer>
                <div className="flex justify-between">
                    <h1 className="text-2xl">Client Cutting List</h1>
                    <SearchForm isCuttingDayComponent={true} />
                </div>
            </ContentContainer>
            <Suspense fallback={<ContentContainer>Loading...</ContentContainer>}>
                <ClientListCutting clientsPromise={clientsPromise} clientListPage={clientListPage} searchTerm={"searchTerm"} date={cuttingDate} />
            </Suspense>
        </>
    );
}