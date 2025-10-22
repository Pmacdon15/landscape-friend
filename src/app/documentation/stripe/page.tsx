import FillFormContainer from '@/components/ui/containers/fill-form-container'
import FormContainer from '@/components/ui/containers/form-container'
import FormHeader from '@/components/ui/header/form-header'
import BackToDocsLink from '@/components/ui/links/back-to-docs-link'
import ScribeContainer from '@/components/ui/scribe/scribe-container'
import ScribeIframe from '@/components/ui/scribe/scribe-iframe'

export default function Page() {
	return (
		<FormContainer>
			<FillFormContainer>
				<FormHeader text={'Stripe'} />
				<ScribeContainer text="Switch to production">
					<ScribeIframe url="https://scribehow.com/embed/Create_a_Stripe_Account_and_Switch_to_Live_Mode__Gj5DvOBPRqS9KzOyk-uvew" />
				</ScribeContainer>
				<ScribeContainer text="Branding">
					<ScribeIframe url="https://scribehow.com/embed/Customize_Your_Stripe_Invoice_Branding_Settings__N-dNtjD0RrOXSFyEwINFIg" />
				</ScribeContainer>
				<ScribeContainer text="Tax">
					<ScribeIframe url="https://scribehow.com/embed/How_to_Set_Up_Stripe_Tax_Registrations__vT9RPkWESISEjwSSV-e_zA" />
				</ScribeContainer>
				<ScribeContainer text="Getting and Setting API key">
					<ScribeIframe url="https://scribehow.com/embed/How_to_Enable_Invoicing_with_Stripe__l4ib7MmMSbaEJ6y7_07AHw" />
				</ScribeContainer>
				<BackToDocsLink />
			</FillFormContainer>
		</FormContainer>
	)
}
