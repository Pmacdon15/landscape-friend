import SearchForm from "@/components/ui/search/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { fetchCuttingClients } from "@/lib/dal/clients-dal";
import { isOrgAdmin } from "@/lib/utils/clerk";
import { Suspense } from "react";
import ClientListService from "../../../components/ui/service-list/clients-list-service";
import { parseClientListParams } from "@/lib/utils/params";

import SearchFormFallBack from "@/components/ui/fallbacks/search/search-form-fallback";
import { fetchOrgMembers } from "@/lib/dal/dal-org";

export default async function Page(props: PageProps<'/lists/cutting'>) {
    const [{ isAdmin }, params] = await Promise.all([
        isOrgAdmin(),
        props.searchParams,
    ]);

    const { page, searchTerm, serviceDate, searchTermIsServiced, searchTermAssignedTo } = parseClientListParams(params);

    const clientsPromise = serviceDate ? fetchCuttingClients(page, searchTerm, serviceDate, searchTermIsServiced, searchTermAssignedTo) : Promise.resolve(null);
    const orgMembersPromise = fetchOrgMembers();
    return (
        <>
            <FormContainer>
                <FormHeader text={"Cutting List"} />
                <Suspense fallback={<SearchFormFallBack variant="cutting" />}>
                    <SearchForm variant="cutting" orgMembersPromise={orgMembersPromise} isAdmin={isAdmin} />
                </Suspense>
            </FormContainer>
            <Suspense fallback={<FormContainer><FormHeader text="Loading . . ." /></FormContainer>}>
                <ClientListService
                    clientsPromise={clientsPromise}
                    page={page}
                    serviceDate={serviceDate}
                    searchTermIsServiced={searchTermIsServiced}
                    isAdmin={isAdmin} />
            </Suspense>
        </>
    );
}