import AddClientFormClientComponent from "@/components/ui/client-list/add-client-form-client-component";
import { AddClientFormServerComponent } from "@/components/ui/client-list/add-client-form-server-component";
import ClientListAll from "@/components/ui/client-list/client-list-all";
import ContentContainer from "@/components/ui/containers/content-container";
import { Suspense } from "react";

export default function page() {
    return (
        <>
            <ContentContainer>
                <h1 className="text-2xl">Client List</h1>
            </ContentContainer>
            <AddClientFormClientComponent>
                <AddClientFormServerComponent />
            </AddClientFormClientComponent>
            <Suspense fallback={<ContentContainer>Loading...</ContentContainer>}>
                <ClientListAll />
            </Suspense>
        </>
    );
}