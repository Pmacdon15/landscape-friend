import AddClientFormClientComponent from "@/components/ui/client-list/add-client-form-client-component";
import { AddClientFormServerComponent } from "@/components/ui/client-list/add-client-form-server-component";
import ClientListAll from "@/components/ui/client-list/client-list-all";
import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { fetchOrgMembers } from "@/lib/dal/dal-org";
import { isOrgAdmin } from "@/lib/server-funtions/clerk";
import { Suspense } from "react";
import { parseClientListParams } from "@/lib/server-funtions/params";
import { fetchAllClients } from "@/lib/dal/clients-dal";
import { SearchParams } from "@/types/types-params";

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
                <Suspense>
                    <SearchForm />
                </Suspense >
            </FormContainer >
            {isAdmin &&
                <AddClientFormClientComponent>
                    <AddClientFormServerComponent />
                </AddClientFormClientComponent>
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
