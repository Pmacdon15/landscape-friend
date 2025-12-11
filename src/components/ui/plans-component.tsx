import { PricingTable } from '@clerk/nextjs'
import FillFormContainer from './containers/fill-form-container'
import FormContainer from './containers/form-container'
import FormHeader from './header/form-header'
import BackToDocsLink from './links/back-to-docs-link'

export default function PlansComponent() {
	return (
		<FormContainer popover={true}>
			<FillFormContainer>
				<FormHeader text={'Plans'} />
				<div className="flex flex-col items-center gap-4 rounded-sm border p-4">
					<FormHeader text={'Organization Plans'} />
					<PricingTable for="organization" />
				</div>
				<BackToDocsLink />
			</FillFormContainer>
		</FormContainer>
	)
}
