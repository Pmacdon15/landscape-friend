'use client'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { useMarkYardServiced } from '@/lib/mutations/mutations'
import { Button } from '../button'

export default function MarkYardServiced({
	clientId,
	serviceDate,
	snow = false,
}: {
	clientId: number
	serviceDate: Date
	snow?: boolean
}) {
	const { mutate, isError, isPending } = useMarkYardServiced()
	const [images, setImages] = useState<File[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	const addTimestampToImage = async (file: File): Promise<File> => {
		const img = document.createElement('img')
		const url = URL.createObjectURL(file)

		return new Promise<File>((resolve, reject) => {
			img.onload = () => {
				const canvas = document.createElement('canvas')
				canvas.width = img.width
				canvas.height = img.height

				const ctx = canvas.getContext('2d')
				if (!ctx) {
					reject(new Error('Canvas context not available'))
					return
				}

				// Draw the image
				ctx.drawImage(img, 0, 0)
				//Draw rectangle (bakgroung)
				ctx.fillStyle = 'black'
				ctx.fillRect(0, 0, img.width, 68)

				// Add timestamp text
				const timestamp = new Date().toLocaleString()
				const serviced = snow ? 'SNOW REMOVAL - ' : 'GRASS CUT - '
				ctx.font = '48px Arial'
				ctx.fillStyle = 'red'
				// ctx.strokeStyle = "white";
				ctx.lineWidth = 2
				ctx.textBaseline = 'top'

				const padding = 10
				const x = padding
				const y = padding

				// ctx.strokeText(timestamp, x, y);
				ctx.fillText(serviced + timestamp, x, y)

				// Convert canvas back to Blob
				canvas.toBlob((blob) => {
					if (blob) {
						const newFile = new File([blob], file.name, {
							type: file.type,
						})
						resolve(newFile)
					} else {
						reject(new Error('Failed to convert canvas to Blob'))
					}
				}, file.type)
			}

			img.onerror = () => {
				reject(new Error('Failed to load image'))
			}

			img.src = url
		})
	}

	function isMobileDevice() {
		return /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
	}

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const selectedFile = e.target.files?.[0]
		if (selectedFile) {
			const options = {
				maxSizeMB: 1,
				maxWidthOrHeight: 1920,
				useWebWorker: true,
			}

			let compressedFile = selectedFile

			if (selectedFile.size / 1024 / 1024 > 1) {
				compressedFile = await imageCompression(selectedFile, options)
			}

			const imageWithTimeStamp = await addTimestampToImage(compressedFile)

			setImages([...images, imageWithTimeStamp])
		}
	}
	if (!isMobileDevice())
		return (
			<div className="flex flex-col items-center select-none px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out">
				<h1>Device not supported for complete services</h1>
			</div>
		)

	return (
		<>
			{isError && <p className="text-red-500">Error Marking Cut</p>}
			<label>
				<input
					accept="image/*"
					capture
					className="hidden"
					name="image"
					onChange={handleFileChange}
					ref={fileInputRef}
					required
					type="file"
				/>
				<div className="flex flex-col items-center select-none px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out">
					<div className="text-6xl">📸</div>
					<div className="px-2 max-w-full truncate">
						{images.length === 0
							? 'Take a photo to complete the service'
							: 'Add more photos'}
					</div>
				</div>
			</label>
			{images.length > 0 && (
				<>
					{images.map((img, index) => (
						<Image
							alt={'Site Serviced Photo'}
							height={400}
							key={index}
							src={URL.createObjectURL(new Blob([img]))}
							width={400}
						/>
					))}

					<Button
						disabled={isPending}
						onClick={() =>
							images
								? mutate({
										clientId,
										date: serviceDate,
										snow,
										images,
									})
								: null
						}
						variant={'outline'}
					>
						Mark Yard Serviced
					</Button>
				</>
			)}
		</>
	)
}
