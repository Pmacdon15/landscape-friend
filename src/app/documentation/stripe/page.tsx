import FillFormContainer from "@/components/ui/containers/fill-form-container";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import BackToDocsLink from "@/components/ui/links/back-to-docs-link";
import ScribeContainer from "@/components/ui/scribe/scribe-container";

export default function Page() {
    return (
        <FormContainer>
            <FillFormContainer>
                <FormHeader text={'Stripe'} />
                <ScribeContainer text="Branding">
                    <iframe src="https://scribehow.com/embed/Customize_Your_Stripe_Invoice_Branding_Settings__N-dNtjD0RrOXSFyEwINFIg"
                        allow="fullscreen"
                        className="aspect-square border-0 rounded-sm min-h-[400px] " />
                </ScribeContainer>
                <BackToDocsLink />
            </FillFormContainer>
        </FormContainer >
    );
}