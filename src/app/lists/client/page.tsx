import ClientListAll from "@/components/ui/client-list/client-list-all";
import SearchForm from "@/components/ui/search/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { fetchOrgMembers } from "@/lib/dal/dal-org";
import { isOrgAdmin } from "@/lib/utils/clerk";
import { Suspense } from "react";
import { parseClientListParams } from "@/lib/utils/params";
import { fetchAllClients } from "@/lib/dal/clients-dal";
import { SearchParams } from "@/types/params-types";
import SearchFormFallBack from "@/components/ui/fallbacks/search/search-form-fallback";
import AddClientFormContainer from "@/components/ui/client-list/add-client-form-container";

export default async function page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const [{ isAdmin }, params] = await Promise.all([
        isOrgAdmin(),
        searchParams,
    ]);

    const { page, searchTerm, searchTermCuttingWeek, searchTermCuttingDay } = parseClientListParams(params);
    const clientsPromise = fetchAllClients(page, searchTerm, searchTermCuttingWeek, searchTermCuttingDay);
    const orgMembersPromise = fetchOrgMembers();

    return (
        <>
            <FormContainer>
                <FormHeader text={"Client List"} />
                <Suspense fallback={<SearchFormFallBack />}>
                    <SearchForm orgMembersPromise={orgMembersPromise}/>
                </Suspense >
            </FormContainer >
            {isAdmin &&
                <AddClientFormContainer/>
            }
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListAll
                    clientsPromise={clientsPromise}
                    page={page}
                    isAdmin={isAdmin}
                    orgMembersPromise={orgMembersPromise}
                />
            </Suspense>
        </>
    );
}
