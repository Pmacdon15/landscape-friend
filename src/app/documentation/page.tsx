import { BookOpenIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import FillFormContainer from '@/components/ui/containers/fill-form-container'
import FormContainer from '@/components/ui/containers/form-container'
import FormHeader from '@/components/ui/header/form-header'
import BackToLink from '@/components/ui/links/back-to-link'

export default function Page() {
	const documentationLinks = [
		{
			id: 1,
			text: 'Plans',
			href: '/documentation/plans',
			info: 'View info and learn about our plans',
			icon: <BookOpenIcon className="h-5 w-5 text-gray-500" />,
		},
		{
			id: 2,
			text: 'Stripe',
			href: '/documentation/stripe',
			info: 'Learn how to set up Stripe to enable billing features',
			icon: <CreditCardIcon className="h-5 w-5 text-gray-500" />,
		},
	] as const

	return (
		<>
			<FormContainer>
				<FormHeader text="Documentation" />
				<FillFormContainer>
					<ul className="space-y-4">
						{documentationLinks.map((link, _index) => (
							<li
								className="flex items-start space-x-2 border rounded-sm p-4  shadow:sm hover:scale-101 hover:shadow-2xl bg-white/40"
								key={link.id}
							>
								<Link
									className="h-full w-full "
									href={link.href}
								>
									{link.icon}
									<p className="hover:underline font-semibold">
										{link.text}
									</p>
									<p className="hover:underline text-gray-600 font-medium">
										{link.info}
									</p>
								</Link>
							</li>
						))}
					</ul>
				</FillFormContainer>
			</FormContainer>
			<BackToLink path={'/'} place={'Home'} />
		</>
	)
}
