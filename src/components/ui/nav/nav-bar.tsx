"use client"
import * as React from "react"
import { Button } from "../button"
import { Suspense, useState } from "react"
import { Menu } from "lucide-react"

import NavigationMenuComponent from "./nav-menu-component"

export function NavBar({ userId, isAdmin, hasStripAPIKeyPromise }: { userId: string, isAdmin: boolean, hasStripAPIKeyPromise: Promise<boolean> }) {

    const [showNav, setShowNav] = useState(false)

    return (
        <>
            <div className="md:hidden flex flex-col gap-2 pb-2">
                <Button variant="outline" onClick={() => setShowNav(!showNav)} className="p-2 w-9">
                    <Menu size={24} />
                </Button>
                {showNav && <Suspense><NavigationMenuComponent hasStripAPIKeyPromise={hasStripAPIKeyPromise} userId={userId} isAdmin={isAdmin} /></Suspense>}
            </div>

            <div className="hidden md:block"><Suspense><NavigationMenuComponent hasStripAPIKeyPromise={hasStripAPIKeyPromise} userId={userId} isAdmin={isAdmin} /></Suspense></div>
        </>
    )
}

