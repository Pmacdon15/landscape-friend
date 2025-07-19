import ContentContainer from "@/components/ui/containers/content-container";

export default function Loading() {
    return (
        <>
            <ContentContainer>
                <h1 className="text-2xl">Client List</h1>
            </ContentContainer>
            <ContentContainer>
                <h1 className="text-2xl">Loading...</h1>
            </ContentContainer>
        </>
    );
}