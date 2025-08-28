import FillFormContainer from "@/components/ui/containers/fill-form-container";
import FormContainer from "@/components/ui/containers/form-container";
import { EditInvoiceFormFallback } from "@/components/ui/fallbacks/edit-invoice-form-fallback";
import FormHeader from "@/components/ui/header/form-header";

export default function Loading() {
    return (
        <FormContainer>
            <FillFormContainer>
                <FormHeader text={'Edit Stripe Invoice'} />
                <div className="p-4 border rounded-md shadow-sm">
                    <EditInvoiceFormFallback />
                </div>
            </FillFormContainer>
        </FormContainer >
    );
}