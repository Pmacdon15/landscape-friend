'use client'
import { Menu } from 'lucide-react'
import { Suspense } from 'react'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
// import * as React from "react"
import { Button } from '../button'
// import NavigationMenuComponent from "./nav-menu-component"
import VerticalNav from './vertical-nav'

export function NavBar() {
	return (
		<>
			<div>
				<Sheet>
					<SheetTrigger asChild>
						<Button className="w-9 p-2" variant="outline">
							<Menu size={24} />
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<SheetTitle className="sr-only">
							Navigation Menu
						</SheetTitle>
						<SheetDescription className="sr-only">
							A list of navigation links.
						</SheetDescription>
						<Suspense>
							<VerticalNav />
						</Suspense>
					</SheetContent>
				</Sheet>
			</div>
			{/* //TODO fix the desktop nac bar to not be behind the images */}
			{/* <div className="hidden lg:flex lg:flex-row lg:justify-start"><Suspense><NavigationMenuComponent userId={userId} /></Suspense></div> */}
		</>
	)
}
