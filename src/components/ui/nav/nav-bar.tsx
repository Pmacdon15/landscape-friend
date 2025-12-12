'use client'
import { Menu } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '../button'
import NavigationMenuComponent from './nav-menu-component'
import VerticalNav from './vertical-nav'

export function NavBar() {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1024)
		}

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<>
			{isMobile ? (
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
			) : (
				<div className="hidden lg:flex lg:flex-row lg:justify-start">
					<NavigationMenuComponent />
				</div>
			)}
		</>
	)
}
