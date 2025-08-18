import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useMediaQuery } from "@/lib/hooks/hooks";
import Link from "next/link";
import { use } from "react";

export default function NavigationMenuComponent({ userId, isAdmin, hasStripAPIKeyPromise }: { userId: string, isAdmin: boolean, hasStripAPIKeyPromise: Promise<boolean> }) {
    const date = new Date();
    const today = date.toISOString().split('T')[0]; // YYYY-MM-DD in UTC
    const isMd = useMediaQuery("(min-width: 768px)");

    const hasStripAPIKey = use(hasStripAPIKeyPromise)
    return (
        <NavigationMenu viewport={!isMd}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>List</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link href="/lists/client">
                                        <div className="font-medium">Client List</div>
                                        <div className="text-muted-foreground">
                                            Add, browse and manage clients.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href={{
                                        pathname: '/lists/cutting',
                                        query: { date: today },
                                    }}>
                                        <div className="font-medium">Cutting List</div>
                                        <div className="text-muted-foreground">
                                            Track cutting days and clients.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href={{
                                        pathname: '/lists/clearing',
                                        query: { date: today, assigned: userId },
                                    }} as={`/lists/clearing?date=${today}&assigned=${userId}`}>
                                        <div className="font-medium">Clearing List</div>
                                        <div className="text-muted-foreground">
                                            Track clients that need to be cleared.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Email </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                {isAdmin && <NavigationMenuLink asChild>
                                    <Link href="/email/news-letter">
                                        <div className="font-medium">Send News Letter</div>
                                        <div className="text-muted-foreground">
                                            Send all clients an update email.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>}
                                <NavigationMenuLink asChild>
                                    <Link href="/email/individual">
                                        <div className="font-medium">Send Individual</div>
                                        <div className="text-muted-foreground">
                                            Send an email to a client.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                {isAdmin && hasStripAPIKey &&
                    <>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Billing</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[300px] gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link href="/billing/send-quote">
                                                <div className="font-medium">Send a Quote</div>
                                                <div className="text-muted-foreground">
                                                    Send an Quote as an Email.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="/invoice/all">
                                                <div className="font-medium">Manage Quotes</div>
                                                <div className="text-muted-foreground">
                                                    Manage quotes mark accepted, cancel.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="/billing/manage/invoices">
                                                <div className="font-medium">Manage Invoices</div>
                                                <div className="text-muted-foreground">
                                                    Manage invoices view, send, resend, mark paid.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </>
                }
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link href="/settings/stripe-api-key">
                                        <div className="font-medium">Set Stripe API key</div>
                                        <div className="text-muted-foreground">
                                            Enable invoicing by managing your stripe API key.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu >

    );
}