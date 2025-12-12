import Image from 'next/image'
import FillFormContainer from '../containers/fill-form-container'
import FormContainer from '../containers/form-container'
export default function WhyChooseUsMessage() {
	return (
		<div className="mx-auto w-full items-center justify-center overflow-hidden lg:w-5/6">
			<div className="flex flex-col md:flex-row">
				<div className="logo-slide-in mt-4 sm:mb-4 md:mt-0 md:mr-4">
					<FormContainer popover={true}>
						<FillFormContainer>
							<h1 className="mb-6 font-bold text-3xl">
								Why choose Landscape Friend?
							</h1>
							<p className="mb-4 indent-4">
								Landscape Friend is your all-in-one solution for
								lawn care management. Whether you property owner
								or a professional landscaper, our platform
								offers tools to help you schedule services,
								track maintenance, and manage your lawn care
								tasks efficiently.
							</p>
							<h2 className="mb-4 font-semibold text-2xl">
								What we Provide:
							</h2>
							<ul className="mb-4 list-inside list-disc">
								<li>
									A streamed-lined platform for managing
									clients for landscaping related work
								</li>
								<li>
									Easy payments and invoicing integrated
									through Stripe's platform
								</li>
								<li>
									Assign clients maintenance needs to
									organization members
								</li>
								<li>
									Order or reorder your route between clients
									homes, easily see your clients on a map with
									a link to google maps.
								</li>
								<li>
									Send out email and your clients with ease
								</li>
							</ul>
							<p className="mb-4">
								Join Landscape Friend today and take the first
								step towards your landscaping career!
							</p>
						</FillFormContainer>
					</FormContainer>
				</div>
				<div className="logo-slide-in-reverse mt-4 pb-4 md:mt-0 md:shrink-0 sm:1/3 ">
					<Image
						alt="Lawn Mower Mowing a Lawn"
						className="h-64 w-full object-cover md:h-full md:w-96 "
						height={800}
						src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/lawnmowerstock.jpg"
						width={800}
					/>
				</div>
			</div>
		</div>
	)
}
