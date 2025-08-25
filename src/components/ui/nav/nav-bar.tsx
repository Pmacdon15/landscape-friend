"use client"
import * as React from "react"
import { Button } from "../button"
import { Suspense, use, useState } from "react"
import { Menu } from "lucide-react"

import NavigationMenuComponent from "./nav-menu-component"
import { UserNovuId } from "@/types/types-novu"

export function NavBar({ userId }: { userId: string }) {

    const [showNav, setShowNav] = useState(false)

    return (
        <>
            <div className="md:hidden flex flex-col gap-2 pb-2">
                <Button variant="outline" onClick={() => setShowNav(!showNav)} className="p-2 w-9">
                    <Menu size={24} />
                </Button>
                {showNav && <Suspense><NavigationMenuComponent userId={userId} /></Suspense>}
            </div>

            <div className="hidden md:block"><Suspense><NavigationMenuComponent userId={userId} /></Suspense></div>
        </>
    )
}

