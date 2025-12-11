import Link from 'next/link'
import { Button } from '../button'
import FillFormContainer from '../containers/fill-form-container'
import FormContainer from '../containers/form-container'

export default function WelcomeMessage() {
	return (
		<div className="mx-auto w-full items-center justify-center lg:w-5/6">
			<div className="logo-slide-in-reverse mt-4 w-full md:mt-0">
				<FormContainer popover={true}>
					<FillFormContainer>
						<h1 className="mb-6 font-bold text-3xl">
							Welcome to Landscape Friend
						</h1>
						<p className="mb-4 indent-4">
							We can help you manage billing and maintenance
							schedules with our streamed lined software made by
							people that have experience in your industry.
						</p>
						<p className="mb-4 indent-4 flex ">
							Let us get you started with us today, have questions? 
							<Link href={'/'}>
								<Button variant={'outline'}>
									Send us a message today!
								</Button>
							</Link>
						</p>
					</FillFormContainer>
				</FormContainer>
			</div>
		</div>
	)
}
