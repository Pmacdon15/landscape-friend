import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import Link from "next/link";

export default function NavigationMenuComponent() {
    return (
        <NavigationMenu >
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>List</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link href="/client-list">
                                        <div className="font-medium">Client List</div>
                                        <div className="text-muted-foreground">
                                            Add, browse and manage clients.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="/cutting-list">
                                        <div className="font-medium">Cutting List</div>
                                        <div className="text-muted-foreground">
                                            Track cutting days and clients.
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
                                <NavigationMenuLink asChild>
                                    <Link href="/email/news-letter">
                                        <div className="font-medium">Send News Letter</div>
                                        <div className="text-muted-foreground">
                                            Send all clients an update email.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
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
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Invoices</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link href="/invoice/all">
                                        <div className="font-medium">Send All</div>
                                        <div className="text-muted-foreground">
                                            Send invoices for all outstanding balances.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="/invoice/individual">
                                        <div className="font-medium">Send Individual</div>
                                        <div className="text-muted-foreground">
                                            Send an invoice to a client with an outstanding balance.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="/invoice/send-estimate">
                                        <div className="font-medium">Send as Estimate</div>
                                        <div className="text-muted-foreground">
                                            Send an invoice as an estimate.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

    );
}