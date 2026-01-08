'use client'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useMarkYardServiced } from '@/lib/mutations/mutations'
import { Button } from '../button'
import Spinner from '../loaders/spinner'

export default function MarkYardServiced({
	clientId,
	serviceDate,
	snow = false,
}: {
	clientId: number
	serviceDate: Date
	snow?: boolean
}) {
	const { mutate, isError, isPending, error } = useMarkYardServiced({
		onSuccess: () => {
			toast.success('Yard marked serviced!', { duration: 1500 })
		},
		onError: (error) => {
			console.error('Error marking yard serviced', error)
			toast.error('Error marking yard serviced!', { duration: 1500 })
		},
	})
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
		// return true
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
			<div className="flex select-none flex-col items-center rounded-md border border-gray-300 bg-white px-6 py-3 shadow-sm transition duration-300 ease-in-out hover:bg-green-200">
				<h1>Device not supported for complete services</h1>
			</div>
		)

	return (
		<>
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
				<div className="flex select-none flex-col items-center rounded-md border border-gray-300 bg-white px-6 py-2 shadow-sm transition duration-300 ease-in-out hover:bg-green-200">
					<div className="text-4xl">📸</div>
					<div className="max-w-full truncate px-2">
						{images.length === 0
							? 'Mark service complete'
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
							key={`${img.name}-${index}`}
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
						Mark Yard Serviced{isPending && <Spinner />}
					</Button>
					{isError && (
						<p className="text-red-500">
							{error.message ?? 'Error Marking Serviced'}
						</p>
					)}
				</>
			)}
		</>
	)
}
