'use client'
import {
	ChevronDownIcon,
	FileText,
	Mails,
	Receipt,
	ScrollText,
	Settings,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useGetIsAdmin } from '@/lib/hooks/useClerk'
import { useHasStripeApiKey } from '@/lib/hooks/useStripe'
import SheetLogoHeader from '../header/sheet-logo-header'

const CollapsibleSection = ({
	title,
	children,
}: {
	title: string | React.ReactNode
	children: React.ReactNode
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const toggleOpen = () => setIsOpen(!isOpen)

	return (
		<div>
			<div
				className="flex items-center justify-between w-full p-2 font-medium text-left cursor-pointer"
				onClick={toggleOpen}
			>
				<span className="flex gap-2">{title}</span>
				<ChevronDownIcon
					className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
					size={16}
				/>
			</div>
			{isOpen && (
				<div className="pl-4 py-2 flex flex-col gap-2">{children}</div>
			)}
		</div>
	)
}
export default function VerticalNav() {
	const date = new Date()
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const today = `${year}-${month}-${day}`

	const { data: isAdmin } = useGetIsAdmin()
	const { data: hasStripAPIKey } = useHasStripeApiKey()

	return (
		<nav className="flex flex-col gap-2 w-full">
			<SheetLogoHeader />
			<CollapsibleSection
				title={
					<>
						<ScrollText />
						List
					</>
				}
			>
				<Link
					className="p-2 hover:bg-accent rounded-md"
					href="/lists/client"
				>
					Client List
				</Link>
				<Link
					className="p-2 hover:bg-accent rounded-md"
					href={{
						pathname: '/lists/cutting',
						query: { date: today },
					}}
				>
					Cutting List
				</Link>
				<Link
					className="p-2 hover:bg-accent rounded-md"
					href={{
						pathname: '/lists/clearing',
						query: { date: today },
					}}
				>
					Clearing List
				</Link>
			</CollapsibleSection>

			<CollapsibleSection
				title={
					<>
						<Mails />
						Email
					</>
				}
			>
				<Link
					className="p-2 hover:bg-accent rounded-md"
					href="/email/individual"
				>
					Send Individual
				</Link>
			</CollapsibleSection>

			{isAdmin && hasStripAPIKey && (
				<CollapsibleSection
					title={
						<>
							<Receipt /> Billing
						</>
					}
				>
					<Link
						className="p-2 hover:bg-accent rounded-md"
						href="/billing/create-quote"
					>
						Create a Quote
					</Link>
					<Link
						className="p-2 hover:bg-accent rounded-md"
						href="/billing/manage/quotes"
					>
						Manage Quotes
					</Link>
					<Link
						className="p-2 hover:bg-accent rounded-md"
						href="/billing/manage/invoices"
					>
						Manage Invoices
					</Link>
					<Link
						className="p-2 hover:bg-accent rounded-md"
						href="/billing/manage/subscriptions"
					>
						Manage Subscriptions
					</Link>
				</CollapsibleSection>
			)}

			<CollapsibleSection
				title={
					<>
						<FileText /> Documentation
					</>
				}
			>
				<Link
					className="p-2 hover:bg-accent rounded-md"
					href="/documentation/plans"
				>
					Plans
				</Link>
				<Link
					className="p-2 hover:bg-accent rounded-md"
					href="/documentation/stripe"
				>
					Stripe
				</Link>
			</CollapsibleSection>

			{isAdmin && (
				<CollapsibleSection
					title={
						<>
							<Settings /> Settings
						</>
					}
				>
					<Link
						className="p-2 hover:bg-accent rounded-md"
						href="/settings"
					>
						Manage settings
					</Link>
				</CollapsibleSection>
			)}
		</nav>
	)
}
