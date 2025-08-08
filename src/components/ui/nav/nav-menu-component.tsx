import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useMediaQuery } from "@/hooks/hooks";
import Link from "next/link";

export default function NavigationMenuComponent() {
      const isMd = useMediaQuery("(min-width: 768px)");
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
                                    <Link href="/lists/cutting">
                                        <div className="font-medium">Cutting List</div>
                                        <div className="text-muted-foreground">
                                            Track cutting days and clients.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="/lists/snow-clearing">
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
        </NavigationMenu>

    );
}