'use client'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ImagePlusIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { ImageGalleryProps } from '@/types/components-types'
import DeleteSiteMapButton from '../buttons/delete-site-map-button'

export default function ImageGallery({
	isAdmin,
	client,
	setView,
}: ImageGalleryProps) {
	const [previewSrc, setPreviewSrc] = useState<string | null>(null)
	return (
		<div className="relative w-full lg:w-4/6  mx-auto h-[300px] overflow-y-auto bg-background rounded-md p-2">
			{isAdmin && (
				<div
					className={`flex flex-nowrap absolute top-1 right-1 z-10 px-4 py-2`}
				>
					<button
						className="select-none cursor-pointer px-6 py-2 bg-background rounded border shadow-lg hover:bg-green-300"
						onClick={() => setView('add')}
					>
						<ImagePlusIcon className="w-5 h-5 text-white" />
					</button>
				</div>
			)}

			<div className="flex flex-wrap justify-center align-middle items-center h-full">
				{client.images?.map((image, index) => (
					<div className="relative" key={index}>
						<DeleteSiteMapButton
							clientId={client.id}
							siteMapId={image.id}
						/>

						<Image
							alt={`Image ${index + 1}`}
							className="p-2 hover:cursor-zoom-in"
							height={300}
							onClick={() => {
								setPreviewSrc(image.url)
							}}
							src={image.url}
							width={300}
						/>
					</div>
				))}
			</div>

			{/* Fullscreen Preview */}
			{previewSrc && (
				<div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
					<Image
						alt="Full screen preview"
						className="object-contain"
						fill
						src={previewSrc}
					/>
					<button
						className="absolute top-4 right-4 text-white p-2 hover:bg-gray-800 rounded-full"
						onClick={() => setPreviewSrc(null)}
					>
						<XMarkIcon className="h-8 w-8" />
					</button>
				</div>
			)}
		</div>
	)
}
