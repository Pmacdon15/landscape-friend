'use client'
import * as React from "react"
import { Button } from "../button"
import { Suspense } from "react"
import { Menu } from "lucide-react"
import NavigationMenuComponent from "./nav-menu-component"
import VerticalNav from "./vertical-nav"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function NavBar({ userId }: { userId: string }) {
    return (
        <>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="p-2 w-9">
                            <Menu size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <Suspense><VerticalNav userId={userId} /></Suspense>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:block"><Suspense><NavigationMenuComponent userId={userId} /></Suspense></div>
        </>
    )
}