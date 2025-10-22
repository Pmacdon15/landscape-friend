'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useGetIsAdmin } from '@/lib/hooks/useClerk'
import { useHasStripeApiKey } from '@/lib/hooks/useStripe'
import {
	ChevronDownIcon,
	FileText,
	Mails,
	Receipt,
	ScrollText,
	Settings,
} from 'lucide-react'
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
					href="/lists/client"
					className="p-2 hover:bg-accent rounded-md"
				>
					Client List
				</Link>
				<Link
					href={{
						pathname: '/lists/cutting',
						query: { date: today },
					}}
					className="p-2 hover:bg-accent rounded-md"
				>
					Cutting List
				</Link>
				<Link
					href={{
						pathname: '/lists/clearing',
						query: { date: today },
					}}
					className="p-2 hover:bg-accent rounded-md"
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
					href="/email/individual"
					className="p-2 hover:bg-accent rounded-md"
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
						href="/billing/create-quote"
						className="p-2 hover:bg-accent rounded-md"
					>
						Create a Quote
					</Link>
					<Link
						href="/billing/manage/quotes"
						className="p-2 hover:bg-accent rounded-md"
					>
						Manage Quotes
					</Link>
					<Link
						href="/billing/manage/invoices"
						className="p-2 hover:bg-accent rounded-md"
					>
						Manage Invoices
					</Link>
					<Link
						href="/billing/manage/subscriptions"
						className="p-2 hover:bg-accent rounded-md"
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
					href="/documentation/plans"
					className="p-2 hover:bg-accent rounded-md"
				>
					Plans
				</Link>
				<Link
					href="/documentation/stripe"
					className="p-2 hover:bg-accent rounded-md"
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
						href="/settings"
						className="p-2 hover:bg-accent rounded-md"
					>
						Manage settings
					</Link>
				</CollapsibleSection>
			)}
		</nav>
	)
}
