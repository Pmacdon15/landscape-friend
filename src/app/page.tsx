'use client'
import Link from 'next/link'
import FormContainer from '@/components/ui/containers/form-container'
import '@/animations/landing-page.css'
import Image from 'next/image'
import FillFormContainer from '@/components/ui/containers/fill-form-container'
// import TestAddStripeWebHook from "@/components/ui/test/test-add-stripe-webhook";

export default function Home() {
	return (
		<>
			<div className="width-100% mb-4 flex items-center justify-center overflow-hidden md:overflow-visible">
				<div className="justify-right items-right logo-slide-in flex">
					<Image
						alt="Landscape Friend Logo"
						className="mx-auto mb-4 h-auto w-64"
						height={800}
						src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/logo.png"
						width={800}
					/>
				</div>

				<div className="justify-top items-left logo-slide-in-reverse h-16 flex-columns bg-green-500 text-white">
					<h1 className="font-bold text-3xl">Landscape Friend</h1>
					<div className="fit bg-green-700">
						<h2 className="font-semibold text-xl">
							Your Lawn Care Companion
						</h2>
					</div>
				</div>
			</div>

			<div className="flex-row items-center justify-center">
				<div className="mx-auto max-w-md items-center justify-center overflow-hidden md:max-w-6xl">
					<div className="md:flex">
						<div className="logo-slide-in md:shrink-0">
							<Image
								alt="Lawn Mower Mowing a Lawn"
								className="h-64 w-full object-cover md:h-full md:w-96"
								height={800}
								src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/lawnmowerstock.jpg"
								width={800}
							/>
						</div>
						<div className="logo-slide-in-reverse mt-4 w-full md:mt-0 md:ml-4">
							<FormContainer popover={true}>
								<FillFormContainer>
									<h1 className="mb-6 font-bold text-3xl">
										Welcome to Landscape Friend
									</h1>
									<p className="mb-4 indent-4">
										Thank you for choosing Landscape Friend!
										To learn more about how we work and
										protect your data, please review our{' '}
										<Link
											className="text-blue-600 underline"
											href="/terms-of-service"
										>
											Terms of Service
										</Link>{' '}
										and{' '}
										<Link
											className="text-blue-600 underline"
											href="/privacy-policy"
										>
											Privacy Policy
										</Link>
										.
									</p>
								</FillFormContainer>
							</FormContainer>
							{/* <TestAddStripeWebHook /> */}
						</div>
					</div>
				</div>
			</div>

			<div className="flex-row items-center justify-center">
				<div className="mx-auto max-w-md items-center justify-center overflow-hidden md:max-w-6xl">
					<div className="md:flex">
						<div className="logo-slide-in mt-4 w-full sm:mb-4 md:mt-0 md:mr-4">
							<FormContainer popover={true}>
								<FillFormContainer>
									<h1 className="mb-6 font-bold text-3xl">
										Why choose Landscape Friend?
									</h1>
									<p className="mb-4 indent-4">
										Landscape Friend is your all-in-one
										solution for lawn care management.
										Whether you&apos;re a homeowner or a
										professional landscaper, our platform
										offers tools to help you schedule
										services, track maintenance, and manage
										your lawn care tasks efficiently.
									</p>
									<h2 className="mb-4 font-semibold text-2xl">
										What we Provide:
									</h2>
									<ul className="mb-4 list-inside list-disc">
										<li>
											A secure end-to-end platform for
											managing clients for landscaping
											related work
										</li>
										<li>
											Easy payments and invoicing
											integrated through Stripe&apos;s
											platform
										</li>
										<li>
											Send out updates and newsletters to
											all of your clients with ease
										</li>
									</ul>
									<p className="mb-4">
										Join Landscape Friend today and take the
										first step towards your landscaping
										career!
									</p>
								</FillFormContainer>
							</FormContainer>
						</div>
						<div className="logo-slide-in-reverse mt-4 pb-4 md:mt-0 md:shrink-0">
							<Image
								alt="Lawn Mower Mowing a Lawn"
								className="h-64 w-full object-cover md:h-full md:w-96"
								height={800}
								src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/lawnmowerstock.jpg"
								width={800}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
