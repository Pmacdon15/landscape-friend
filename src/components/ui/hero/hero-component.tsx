import { Button } from "../button";

export default function HeroComponent() {
	return (
		<div
			className="w-full h-[50vh] bg-no-repeat bg-center flex flex-col justify-center items-start"
			style={{
				backgroundImage: `url('/hero4.png')`,
				backgroundSize: 'cover',
			}}
		>
			<div className=" logo-slide-in-reverse pl-8 md:pl-24">
				<h1 className="text-white  mb-4 text-3xl font-bold w-4/6">
					Need to manage your clients' maintenance schedules? We've got you covered.
				</h1>
				<Button variant="outline">Click to see prices</Button>
			</div>
		</div>
	)
}



{/* <div className="justify-right items-right logo-slide-in flex">
                    <Image
                        alt="Landscape Friend Logo"
                        className="mx-auto mb-4 h-auto w-64"
                        height={800}
                        src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/logo.png"
                        width={800}
                    />
                </div> */}

            {/* <div className="justify-top items-left logo-slide-in-reverse h-16 flex-columns bg-green-500 text-white">
                    <h1 className="font-bold text-3xl">Landscape Friend</h1>
                    <div className="fit bg-green-700">
                        <h2 className="font-semibold text-xl">
                            Your Lawn Care Companion
                        </h2>
                    </div>
                </div> */}