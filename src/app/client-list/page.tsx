import AddClientFormClientComponent from "@/components/ui/client-list/add-client-form-client-component";
import { AddClientFormServerComponent } from "@/components/ui/client-list/add-client-form-server-component";
import ClientListAll from "@/components/ui/client-list/client-list-all";
import ContentContainer from "@/components/ui/containers/content-container";
import { isOrgAdmin } from "@/lib/functions";
import { Suspense } from "react";

export default async function page() {
    const { isAdmin } = await isOrgAdmin()
    return (
        <>
            <ContentContainer>
                <h1 className="text-2xl">Client List</h1>
            </ContentContainer>
            {isAdmin &&
                <AddClientFormClientComponent>
                    <AddClientFormServerComponent />
                </AddClientFormClientComponent>
            }
            <Suspense fallback={<ContentContainer>Loading...</ContentContainer>}>
                <ClientListAll />
            </Suspense>
        </>
    );
}