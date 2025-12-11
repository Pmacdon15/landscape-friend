import { PricingTable } from '@clerk/nextjs'
import FillFormContainer from './containers/fill-form-container'
import FormContainer from './containers/form-container'
import FormHeader from './header/form-header'

export default function PlansComponent() {
	return (
		<FormContainer popover={true}>
			<FillFormContainer>
				<FormHeader text={'Plans'} />
				<div className="flex flex-col items-center gap-4 rounded-sm border p-4">
					<FormHeader text={'Organization Plans'} />
					<PricingTable for="organization" />
				</div>
				<h1 className="text-muted-foreground">
					Sign in and create an organization to start free trail!
				</h1>
			</FillFormContainer>
		</FormContainer>
	)
}
