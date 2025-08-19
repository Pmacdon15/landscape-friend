import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";

export default async function BillingManageFallback({ text }: { text: string }) {
    return (
        <FormContainer>
            <FormHeader text={`${text}`} />
        </FormContainer>
    );
}
