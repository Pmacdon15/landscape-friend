import SearchForm from "@/components/ui/client-list/search-form";
import ContentContainer from "@/components/ui/containers/content-container";
import HeaderWithSearch from "@/components/ui/containers/header-with-search";

export default function Loading() {
    return (
        <>
            <ContentContainer>
                <HeaderWithSearch>
                    <h1 className="text-2xl">Client Cutting List</h1>
                    <SearchForm isCuttingDayComponent={true} />
                </ HeaderWithSearch>
            </ContentContainer>
        </>
    );
}