import Image from 'next/image'
import { getServicedImagesUrls } from '@/lib/DB/db-get-images'
import type { Client } from '@/types/clients-types'

export default async function ListServices({ client }: { client: Client }) {
	const imagesUrls = await getServicedImagesUrls(client.id)
	
	if (imagesUrls.length === 0) {
		return (
			<div className="mx-auto mt-2 flex min-h-[300px] w-full flex-col items-center justify-center overflow-y-auto rounded-md bg-background p-2 lg:w-4/6">
				<h1 className="font-bold text-white">No Last Service found</h1>
			</div>
		)
	}
	return (
		<div className="mx-auto mt-2 flex min-h-[300px] w-full flex-col items-center justify-center overflow-y-auto rounded-md bg-background p-2 lg:w-4/6">
			`
			{imagesUrls.map((imageUrl) => (
				<>
					<h1 className="font-bold text-white">
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
