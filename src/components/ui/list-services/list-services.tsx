import Image from 'next/image'
import { getServicedImagesUrls } from '@/lib/DB/db-get-images'
import type { Client } from '@/types/clients-types'

export default async function ListServices({ client }: { client: Client }) {
	const imagesUrls = await getServicedImagesUrls(client.id)
	console.log(`imagesUrls`)
	console.log(imagesUrls)

	if (imagesUrls.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center mt-2 w-full lg:w-4/6  mx-auto min-h-[300px] overflow-y-auto bg-background rounded-md p-2">
				<h1 className="text-white font-bold">No Last Service found</h1>
			</div>
		)
	}
	return (
		<div className="flex flex-col items-center justify-center mt-2 w-full lg:w-4/6  mx-auto min-h-[300px] overflow-y-auto bg-background rounded-md p-2">
			`
			{imagesUrls.map((imageUrl) => (
				<>
					<h1 className="text-white font-bold">
						{`Last Service: ${imageUrl.date.toDateString()}`}
					</h1>
					<Image
						alt="Image"
						className="my-2 py-2"
						height={400}
						src={imageUrl.imageurl}
						width={400}
					/>
				</>
			))}
		</div>
	)
}
