'use client'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ImagePlusIcon } from 'lucide-react'
import Image from 'next/image'
import { Suspense, useState } from 'react'
import type { ImageGalleryProps } from '@/types/components-types'
import DeleteSiteMapButton from '../buttons/delete-site-map-button'

export default function ImageGallery({
	isAdmin,
	siteMaps,
	setView,
	pagePromise,
}: ImageGalleryProps) {
	const [previewSrc, setPreviewSrc] = useState<string | null>(null)
	return (
		<div className="relative mx-auto h-fit w-full overflow-y-auto rounded-md bg-background p-2 lg:w-4/6">
			{isAdmin && (
				<div
					className={`absolute top-1 right-1 z-10 flex flex-nowrap px-4 py-2`}
				>
					<button
						className="cursor-pointer select-none rounded border bg-background px-6 py-2 shadow-lg hover:bg-green-300"
						onClick={() => setView('add')}
						type="button"
					>
						<ImagePlusIcon className="h-5 w-5 text-white" />
					</button>
				</div>
			)}

			<div className="flex h-full flex-wrap items-center justify-center align-middle">
				{siteMaps.map((siteMap, index) => (
					<div className="relative" key={siteMap.imageURL}>
						<Suspense>
							<DeleteSiteMapButton
								pagePromise={pagePromise}
								siteMap={siteMap}
							/>
						</Suspense>

						<Image
							alt={`Image ${index + 1}`}
							className="p-2 hover:cursor-zoom-in"
							height={300}
							onClick={() => {
								setPreviewSrc(siteMap.imageURL)
							}}
							src={siteMap.imageURL}
							width={300}
						/>
					</div>
				))}
			</div>

			{/* Fullscreen Preview */}
			{previewSrc && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
					<Image
						alt="Full screen preview"
						className="object-contain"
						fill
						src={previewSrc}
					/>
					<button
						className="absolute top-4 right-4 rounded-full p-2 text-white hover:bg-gray-800"
						onClick={() => setPreviewSrc(null)}
						type="button"
					>
						<XMarkIcon className="h-8 w-8" />
					</button>
				</div>
			)}
		</div>
	)
}
