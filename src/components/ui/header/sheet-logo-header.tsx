import Image from 'next/image'
import HeaderTitle from './header-title'
export default function SheetLogoHeader() {
	return (
		<div className="flex flex-col justify-center items-center md:p-4 w-full">
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
