import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";


export default function Loading() {
    return (
        <>
            <FormContainer>
                <FormHeader text="Cutting List" />
            </ FormContainer>
            <FormContainer>
                <FormHeader text="Loading..." />
            </FormContainer>
        </>
    );
}

