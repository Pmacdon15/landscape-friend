import {
	PricingTable,
	SignedOut,
	SignInButton,
	SignUpButton,
} from '@clerk/nextjs'
import { Suspense } from 'react'
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
				<div className="flex flex-col items-center sm:flex-row">
					<Suspense>
						<SignedOut>
							<h1 className="text-muted-foreground">
								Sign in and create an organization to start free
								trail!
							</h1>
							<div className="ml-auto flex gap-4 rounded-sm bg-white/30 p-2 backdrop-blur-md backdrop-filter">
								<SignInButton
									forceRedirectUrl={'/documentation/plans'}
								/>
								<SignUpButton
									forceRedirectUrl={'/documentation/plans'}
								/>
							</div>
						</SignedOut>
					</Suspense>
				</div>
			</FillFormContainer>
		</FormContainer>
	)
}
