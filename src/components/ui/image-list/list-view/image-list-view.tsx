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
		<div className="relative mx-auto h-[300px] w-full max-w-md overflow-y-auto rounded-md bg-background p-2">
			<div
				className={`absolute top-3 right-3 z-10 flex flex-nowrap px-4 py-2`}
			>
				<button
					className="cursor-pointer select-none rounded border bg-background px-6 py-2 shadow-lg hover:bg-green-300"
					onClick={() => setView('add')}
					type="button"
				>
					<ImagePlusIcon className="h-5 w-5 text-white" />
				</button>
			</div>

			{client.images?.map((image, index: number) => (
				<Image
					alt={`Image ${index + 1}`}
					className="p-2 hover:cursor-zoom-in"
					height={400}
					key={image.id}
					onClick={() => setPreviewSrc(image.url)}
					src={image.url}
					width={400}
				/>
			))}

			{/* Fullscreen Preview */}
			{previewSrc && (
				<div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-90">
					<Image
						alt="Full screen preview"
						className="max-h-full max-w-full object-cover"
						height={600}
						onClick={() => setPreviewSrc(null)}
						src={previewSrc}
						width={600}
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
