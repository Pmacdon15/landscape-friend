import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import SearchFormFallBack from "@/components/ui/fallbacks/search/search-form-fallback";

export default function Loading() {
    return (
        <FormContainer>
            <FormHeader text={"Manage Subscriptions"} />
            <SearchFormFallBack variant="subscriptions" />
        </FormContainer>
    );
}
