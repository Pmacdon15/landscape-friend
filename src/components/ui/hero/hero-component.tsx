import Image from 'next/image'
import { Button } from '../button'

export default function HeroComponent() {
	return (
		<div
			className="w-full h-[50vh] bg-no-repeat bg-center flex flex-col items-start"
			style={{
				backgroundImage: `url('/hero4.png')`,
				backgroundSize: 'cover',
			}}
		>
			<div className="flex justify-center items-center logo-slide-in-top mt-8 w-full">
				<Image
					alt="Landscape Friend Logo"
					className="h-auto w-16 mr-2"
					height={200}
					src="/logo.png" 
					width={200}
				/>
				<div>
					<h1 className="text-white text-xl font-bold">
						Landscape Friend
					</h1>
					<h2 className="text-white text-sm font-semibold">
						Your Lawn Care Companion
					</h2>
				</div>
			</div>
			<div className="justify-top items-left logo-slide-in-reverse pl-8 md:pl-24 mt-24">
				<h1 className="text-white  mb-4 text-3xl font-bold w-4/6 mt-4">
					Need to manage your clients' maintenance schedules? We've
					got you covered.
				</h1>
				<Button variant="outline">Click to see prices</Button>
			</div>
		</div>
	)
}