import Image from 'next/image'
export default function HeaderImageIco() {
	return (
		<div className="flex items-center">
			<div
				className="p-2 border rounded-sm bg-background w-[50px] md:w-[75px]"
				style={{
					backgroundImage: 'url(/lawn3.jpg)',
					backgroundPosition: '0% 20%', // Show the bottom half of the image
				}}
			>
				<Image
					alt={'logo'}
					height={100}
					src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/logo.png"
					width={100}
				/>
			</div>
		</div>
	)
}
