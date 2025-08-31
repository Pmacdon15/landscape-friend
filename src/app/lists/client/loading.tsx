import FormContainer from "@/components/ui/containers/form-container";
import SearchFormFallBack from "@/components/ui/fallbacks/search/search-form-fallback";
import FormHeader from "@/components/ui/header/form-header";
import EllipsisSpinner from "@/components/ui/loaders/EllipsisSpinner";

export default function Loading() {
    return (
        <>
            <FormContainer>
                <FormHeader text="Client List" />
                <SearchFormFallBack />
            </FormContainer>
            <FormContainer>
                <FormHeader ><div className="flex">Loading<EllipsisSpinner /></div></FormHeader>
            </FormContainer>
        </>
    );
}