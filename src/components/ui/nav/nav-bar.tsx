"use client"
import * as React from "react"
import { Button } from "../button"
import { useState } from "react"
import { Menu } from "lucide-react"

import NavigationMenuComponent from "./nav-menu-component"

export function NavBar() {
    const [showNav, setShowNav] = useState(false)

    return (
        <>
            <div className="md:hidden flex flex-col gap-2">
                <Button variant="outline" onClick={() => setShowNav(!showNav)} className="p-2 w-9">
                    <Menu size={24} />
                </Button>
                {showNav && <NavigationMenuComponent />}
            </div>

            <div className="hidden md:block"><NavigationMenuComponent /></div>
        </>
    )
}

