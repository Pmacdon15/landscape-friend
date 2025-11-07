import Image from 'next/image'
import HeaderTitle from './header-title'
export default function SheetLogoHeader() {
	return (
		<div className="flex w-full flex-col items-center justify-center md:p-4">
			<Image
				alt="Lawn Buddy Logo"
				height={100}
				src="/logo.png"
				width={100}
			/>
			<HeaderTitle text="Landscape Friend" />
		</div>
	)
}
