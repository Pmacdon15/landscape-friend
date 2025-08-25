import FillFormContainer from "@/components/ui/containers/fill-form-container";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";

export default function Page() {
    return (
        <FormContainer>
            <FillFormContainer>
                <FormHeader text={'Plans'} />
                
            </FillFormContainer>
        </FormContainer >
    );
}