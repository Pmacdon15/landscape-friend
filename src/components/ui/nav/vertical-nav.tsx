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
			<button
				className="flex w-full cursor-pointer items-center justify-between p-2 text-left font-medium"
				onClick={toggleOpen}
				type="button"
			>
				<span className="flex gap-2">{title}</span>
				<ChevronDownIcon
					className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
					size={16}
				/>
			</button>
			{isOpen && (
				<div className="flex flex-col gap-2 py-2 pl-4">{children}</div>
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
		<nav className="flex w-full flex-col gap-2">
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
					className="rounded-md p-2 hover:bg-accent"
					href="/lists/client"
				>
					Client List
				</Link>
				<Link
					className="rounded-md p-2 hover:bg-accent"
					href={{
						pathname: '/lists/cutting',
						query: { date: today },
					}}
				>
					Cutting List
				</Link>
				<Link
					className="rounded-md p-2 hover:bg-accent"
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
					className="rounded-md p-2 hover:bg-accent"
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
						className="rounded-md p-2 hover:bg-accent"
						href="/billing/create-quote"
					>
						Create a Quote
					</Link>
					<Link
						className="rounded-md p-2 hover:bg-accent"
						href="/billing/manage/quotes"
					>
						Manage Quotes
					</Link>
					<Link
						className="rounded-md p-2 hover:bg-accent"
						href="/billing/manage/invoices"
					>
						Manage Invoices
					</Link>
					<Link
						className="rounded-md p-2 hover:bg-accent"
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
					className="rounded-md p-2 hover:bg-accent"
					href="/documentation/plans"
				>
					Plans
				</Link>
				<Link
					className="rounded-md p-2 hover:bg-accent"
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
						className="rounded-md p-2 hover:bg-accent"
						href="/settings"
					>
						Manage settings
					</Link>
				</CollapsibleSection>
			)}
		</nav>
	)
}
