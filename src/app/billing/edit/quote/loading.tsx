import FillFormContainer from "@/components/ui/containers/fill-form-container";
import FormContainer from "@/components/ui/containers/form-container";
import { EditDocumentFormFallback } from "@/components/ui/fallbacks/edit-document-form-fallback";
import FormHeader from "@/components/ui/header/form-header";

export default function Loading() {
    return (
        <FormContainer>
            <FillFormContainer>
                <FormHeader text={'Edit Quote'} />
                <div className="p-4 border rounded-md shadow-sm">
                    <EditDocumentFormFallback />
                </div>
            </FillFormContainer>
        </FormContainer >
    );
}