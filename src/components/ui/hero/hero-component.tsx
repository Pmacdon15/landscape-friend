import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../button'

export default function HeroComponent() {
	return (
		<div
			className="flex h-[50vh] w-full flex-col items-start rounded-sm border-2 border-white bg-center bg-no-repeat"
			style={{
				backgroundImage: `url('/hero4.png')`,
				backgroundSize: 'cover',
			}}
		>
			<div className="logo-slide-in-top mt-8 flex w-full items-center justify-center">
				<Image
					alt="Landscape Friend Logo"
					className="mr-2 h-auto w-16"
					height={200}
					src="/logo.png"
					width={200}
				/>
				<div>
					<h1 className="font-bold text-white text-xl">
						Landscape Friend
					</h1>
					<h2 className="font-semibold text-sm text-white">
						Your Lawn Care Companion
					</h2>
				</div>
			</div>
			<div className="justify-top items-left logo-slide-in-reverse mt-8 pl-8 md:mt-24 md:pl-24">
				<h1 className="mb-2 w-4/6 font-bold text-3xl text-white">
					Need to manage your client's maintenance schedules? We've
					got you covered.
				</h1>
				<Link href={'/documentation/plans'}>
					<Button variant="outline">Click to see prices</Button>
				</Link>
			</div>
		</div>
	)
}
