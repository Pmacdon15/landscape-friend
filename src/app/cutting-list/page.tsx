import SearchForm from "@/components/ui/client-list/search-form";
import ContentContainer from "@/components/ui/containers/content-container";
import ClientListCutting from "@/components/ui/cutting-list/clients-list-cutting";
import { FetchAllClients } from "@/DAL/dal";
import { isOrgAdmin } from "@/lib/webhooks";
import { Suspense } from "react";

export default async function page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | number | undefined }>
}) {
    const params = await searchParams;
    const clientListPage = Number(params.page ?? 1);
    const searchTerm = String(params.search ?? '');
    // const searchTermCuttingWeek = Number(params.week ?? 0);
    // const searchTermCuttingDay = String(params.day ?? '');


    const { isAdmin } = await isOrgAdmin()
    // const clientsPromise = FetchAllClients(clientListPage, searchTerm, searchTermCuttingWeek, searchTermCuttingDay);

    return (
        <>
            <ContentContainer>
                <div className="flex justify-between">
                    <h1 className="text-2xl">Client Cutting List</h1>
                    <SearchForm isCuttingDayComponent={true} />
                </div>
            </ContentContainer>
            <Suspense fallback={<ContentContainer>Loading...</ContentContainer>}>
                <ClientListCutting />
            </Suspense>
        </>
    );
}