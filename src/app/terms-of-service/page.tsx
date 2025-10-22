import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ContentContainer from '@/components/ui/containers/content-container'
import { TosSection } from '@/components/ui/tos/tos'

export default function Page() {
	return (
		<>
			<ContentContainer>
				<h1 className="text-2xl font-bold mb-4">Terms of Service</h1>

				<p className="mb-4">
					Welcome to <strong>Landscape Friend</strong>! By accessing
					or using our services, you agree to be bound by the
					following Terms of Service. Please read them carefully.
				</p>

				<TosSection
					text2="Landscape Friend is a web-based platform that allows lawn care providers to manage customers, schedule yard maintenance, track services, and issue invoices and payments. These Terms govern your use of the Landscape Friend platform, website, and services."
					title="1. Overview"
				/>

				<TosSection
					text2="To access Landscape Friend, you must register and maintain an active account. You agree to provide accurate and complete information during registration and keep your account information up-to-date."
					title="2. Account Registration"
				/>

				<TosSection
					text2="You agree to use Landscape Friend only for lawful purposes. You may not use the platform to engage in fraudulent activities, spam, or violate any laws or regulations."
					title="3. Use of Services"
				/>

				<TosSection
					text2={`Landscape Friend allows service providers to integrate their own Stripe API keys to enable secure billing and payment processing. By connecting your Stripe account, our platform can generate invoices, process payments, and manage transaction history on your behalf.\n\nAll financial transactions are conducted through your linked Stripe account, and you are solely responsible for ensuring the accuracy and legality of all billing activities. Landscape Friend acts only as a facilitator and is not liable for any payment disputes or chargebacks between you and your customers.`}
					title="4. Payments and Invoicing"
				/>

				<TosSection
					text2="By using Landscape Friend, you consent to the collection and use of your information in accordance with our Privacy Policy. You are responsible for maintaining the confidentiality of customer data you store in the platform."
					title="5. Data and Privacy"
				/>

				<TosSection
					text2="We reserve the right to suspend or terminate your account at any time if we believe you have violated these Terms or engaged in conduct that could harm our platform or users."
					title="6. Termination"
				/>

				<TosSection
					text2="Landscape Friend may update these Terms at any time. We will provide notice of significant changes, and your continued use of the platform constitutes acceptance of the updated Terms."
					title="7. Modifications"
				/>

				<TosSection
					email="support@landscapefriend.com"
					text2={
						'If you have any questions or concerns about this Privacy Policy, please contact us at'
					}
					title="8. Contact"
				/>
			</ContentContainer>
			<Link href={'/'}>
				<Button variant={'outline'}>Go Home</Button>
			</Link>
		</>
	)
}
