'use client'
import Link from "next/link";
import { useState } from "react";
import { useGetIsAdmin } from "@/lib/hooks/useClerk";
import { useHasStripeApiKey } from "@/lib/hooks/useStripe";
import { ChevronDownIcon } from "lucide-react";
import Image
    from "next/image";
import HeaderTitle from "../header/header-title";
const CollapsibleSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <div className="flex items-center justify-between w-full p-2 font-medium text-left">
                <span>{title}</span>
                <ChevronDownIcon className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={16} />
            </div>
            {isOpen && <div className="pl-4 py-2 flex flex-col gap-2">{children}</div>}
        </div>
    )
}

export default function VerticalNav({ userId }: { userId: string }) {
    const date = new Date();
    const today = date.toISOString().split('T')[0];
    const { data: isAdmin } = useGetIsAdmin();
    const { data: hasStripAPIKey } = useHasStripeApiKey();

    return (
        <nav className="flex flex-col gap-2 w-full">
            <div className="flex flex-col justify-center items-center md:p-4 w-full">
                <Image src="/logo.png" alt="Lawn Buddy Logo" width={100} height={100} />
                <HeaderTitle text='Landscape Friend' />
            </div>
            <CollapsibleSection title="List">
                <Link href="/lists/client" className="p-2 hover:bg-accent rounded-md">Client List</Link>
                <Link href={{ pathname: '/lists/cutting', query: { date: today } }} className="p-2 hover:bg-accent rounded-md">Cutting List</Link>
                <Link href={{ pathname: '/lists/clearing', query: { date: today, assigned: userId } }} className="p-2 hover:bg-accent rounded-md">Clearing List</Link>
            </CollapsibleSection>

            <CollapsibleSection title="Email">
                <Link href="/email/individual" className="p-2 hover:bg-accent rounded-md">Send Individual</Link>
            </CollapsibleSection>

            {isAdmin && hasStripAPIKey && (
                <CollapsibleSection title="Billing">
                    <Link href="/billing/create-quote" className="p-2 hover:bg-accent rounded-md">Create a Quote</Link>
                    <Link href="/billing/manage/quotes" className="p-2 hover:bg-accent rounded-md">Manage Quotes</Link>
                    <Link href="/billing/manage/invoices" className="p-2 hover:bg-accent rounded-md">Manage Invoices</Link>
                </CollapsibleSection>
            )}

            <CollapsibleSection title="Documentation">
                <Link href="/documentation/plans" className="p-2 hover:bg-accent rounded-md">Plans</Link>
                <Link href="/documentation/stripe" className="p-2 hover:bg-accent rounded-md">Stripe</Link>
            </CollapsibleSection>

            <CollapsibleSection title="Settings">
                <Link href="/settings/stripe-api-key" className="p-2 hover:bg-accent rounded-md">Set Stripe API key</Link>
            </CollapsibleSection>
        </nav>
    )
}
