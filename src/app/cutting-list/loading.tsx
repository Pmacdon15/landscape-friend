import SearchForm from "@/components/ui/client-list/search-form";
import ContentContainer from "@/components/ui/containers/content-container";
import HeaderWithSearch from "@/components/ui/containers/header-with-search";
import { Suspense } from "react";

export default function Loading() {
    return (
        <>
            <ContentContainer>
                <HeaderWithSearch>
                    <h1 className="text-2xl">Client Cutting List</h1>
                    <Suspense>
                        <SearchForm isCuttingDayComponent={true} />
                    </Suspense>
                </ HeaderWithSearch>
            </ContentContainer>
        </>
    );
}