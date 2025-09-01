import FillFormContainer from "@/components/ui/containers/fill-form-container";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import BackToDocsLink from "@/components/ui/links/back-to-docs-link";
import ScribeContainer from "@/components/ui/scribe/scribe-container";
import ScribeIframe from "@/components/ui/scribe/scribe-iframe";

export default function Page() {
    return (
        <FormContainer>
            <FillFormContainer>
                <FormHeader text={'Stripe'} />                
                    <ScribeContainer text="Branding">
                        <ScribeIframe url="https://scribehow.com/embed/Customize_Your_Stripe_Invoice_Branding_Settings__N-dNtjD0RrOXSFyEwINFIg" />
                    </ScribeContainer>
                    <ScribeContainer text="Tax">
                        <ScribeIframe url="https://scribehow.com/embed/How_to_Set_Up_Stripe_Tax_Registrations__vT9RPkWESISEjwSSV-e_zA" />
                    </ScribeContainer>               
                <BackToDocsLink />
            </FillFormContainer>
        </FormContainer >
    );
}

{/* <iframe src="https://scribehow.com/embed/How_to_Set_Up_Stripe_Tax_Registrations__vT9RPkWESISEjwSSV-e_zA" 
width="100%" height="640"
 allow="fullscreen"
 style="aspect-ratio: 1 / 1; border: 0; min-height: 480px"></iframe> */}
