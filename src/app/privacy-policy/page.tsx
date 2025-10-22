import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ContentContainer from '@/components/ui/containers/content-container'
import { TosSection } from '@/components/ui/tos/tos'

export default function PrivacyPolicy() {
	return (
		<>
			<ContentContainer>
				<h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

				<p className="mb-4">
					Your privacy is important to us at{' '}
					<strong>Landscape Friend</strong>. This Privacy Policy
					explains how we collect, use, and protect your personal
					information when you use our services.
				</p>

				<TosSection
					text2={`We collect information you provide directly, such as your name, email address, phone number, billing information, and customer details.\n
                    We also collect usage data automatically, including IP addresses, device information, and interaction data to help improve our services.`}
					title="1. Information We Collect"
				/>

				<TosSection
					text2={`We use your information to:\n
                    - Provide, maintain, and improve Landscape Friend services.\n
                    - Manage customer accounts and billing.\n
                    - Communicate important updates and respond to support requests.\n
                    - Comply with legal obligations and prevent fraudulent activity.`}
					title="2. How We Use Your Information"
				/>

				<TosSection
					text2={`We do not sell or rent your personal information to third parties.\n
                    We may share information with trusted service providers (such as payment processors like Stripe) to facilitate billing and service delivery.\n
                    We may disclose information if required by law or to protect rights and safety.`}
					title="3. Sharing Your Information"
				/>

				<TosSection
					text2="We implement reasonable technical and organizational measures to protect your data against unauthorized access, loss, or alteration. However, no method of transmission over the internet is 100% secure."
					title="4. Data Security"
				/>

				<TosSection
					text2={`You can update or correct your account information at any time.\n
                    You may opt-out of marketing communications by following the unsubscribe instructions.\n
                    Please contact us if you want to request deletion of your personal data.`}
					title="5. Your Choices"
				/>

				<TosSection
					text2="We retain your personal data only as long as necessary to provide services and comply with legal obligations."
					title="6. Data Retention"
				/>

				<TosSection
					text2="We may update this Privacy Policy occasionally. We will notify you of significant changes and your continued use of Landscape Friend constitutes acceptance of those changes."
					title="7. Changes to this Privacy Policy"
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
