import { XMarkIcon } from '@heroicons/react/24/outline'
import { ImagePlusIcon } from 'lucide-react'
import Image from 'next/image'
import type { ImageListViewProps } from '@/types/site-map-types'

export default function ImageListView({
	client,
	setView,
	previewSrc,
	setPreviewSrc,
}: ImageListViewProps) {
	return (
		<div className="relative w-full max-w-md mx-auto h-[300px] overflow-y-auto bg-background rounded-md p-2">
			<div
				className={`flex flex-nowrap absolute top-3 right-3 z-10 px-4 py-2`}
			>
				<button
					className="select-none cursor-pointer px-6 py-2 bg-background rounded border shadow-lg hover:bg-green-300"
					onClick={() => setView('add')}
				>
					<ImagePlusIcon className="w-5 h-5 text-white" />
				</button>
			</div>

			{client.images?.map((image, index: number) => (
				<Image
					alt={`Image ${index + 1}`}
					className="p-2 hover:cursor-zoom-in"
					height={400}
					key={index}
					onClick={() => setPreviewSrc(image.url)}
					src={image.url}
					width={400}
				/>
			))}

			{/* Fullscreen Preview */}
			{previewSrc && (
				<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50">
					<Image
						alt="Full screen preview"
						className="max-w-full object-cover max-h-full"
						height={600}
						onClick={() => setPreviewSrc(null)}
						src={previewSrc}
						width={600}
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
