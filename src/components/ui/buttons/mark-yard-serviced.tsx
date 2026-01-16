'use client'

import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useMarkYardServiced } from '@/lib/mutations/mutations'
import { Button } from '../button'
import Spinner from '../loaders/spinner'

export default function MarkYardServiced({
	addressId,
	serviceDate,
	snow = false,
}: {
	addressId: number
	serviceDate: Date
	snow?: boolean
}) {
	const { mutate, isError, isPending, error } = useMarkYardServiced(
		addressId,
		{
			onSuccess: () =>
				toast.success('Yard marked serviced!', { duration: 1500 }),
			onError: () =>
				toast.error('Error marking yard serviced!', { duration: 1500 }),
		},
	)

	const [images, setImages] = useState<File[]>([])
	const [hasCamera, setHasCamera] = useState<boolean | null>(null)
	const [cameraOpen, setCameraOpen] = useState<boolean>(false)

	const videoRef = useRef<HTMLVideoElement>(null)
	const streamRef = useRef<MediaStream | null>(null)

	/* --------------------------------------------
	   CAMERA CHECK
	-------------------------------------------- */
	useEffect(() => {
		async function checkCamera() {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				})

				stream.getTracks().forEach((t) => {
					t.stop()
				})

				setHasCamera(true)
			} catch {
				setHasCamera(false)
			}
		}

		checkCamera()
	}, [])

	/* --------------------------------------------
	   OPEN CAMERA
	-------------------------------------------- */
	const openCamera = async () => {
		setCameraOpen(true)
		const stream = await navigator.mediaDevices.getUserMedia({
			video: { facingMode: 'environment' },
			audio: false,
		})

		streamRef.current = stream

		if (videoRef.current) {
			videoRef.current.srcObject = stream
			await videoRef.current.play()
		}
	}

	/* --------------------------------------------
	   TAKE PHOTO
	-------------------------------------------- */
	const takePhoto = async () => {
		setCameraOpen(false)
		if (!videoRef.current || !streamRef.current) return

		const video = videoRef.current

		const canvas = document.createElement('canvas')
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		ctx.drawImage(video, 0, 0)

		// Stop camera immediately
		streamRef.current.getTracks().forEach((t) => {
			t.stop()
		})
		streamRef.current = null

		const blob = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, 'image/jpeg'),
		)

		if (!blob) return

		let file = new File([blob], `capture-${Date.now()}.jpg`, {
			type: 'image/jpeg',
		})

		// Compress if needed
		if (file.size / 1024 / 1024 > 1) {
			file = await imageCompression(file, {
				maxSizeMB: 1,
				maxWidthOrHeight: 1920,
			})
		}

		const stamped = await addTimestampToImage(file)
		setImages((prev) => [...prev, stamped])
	}

	/* --------------------------------------------
	   TIMESTAMP OVERLAY
	-------------------------------------------- */
	const addTimestampToImage = async (file: File): Promise<File> => {
		const img = document.createElement('img')
		const url = URL.createObjectURL(file)

		return new Promise((resolve, reject) => {
			img.onload = () => {
				const canvas = document.createElement('canvas')
				canvas.width = img.width
				canvas.height = img.height

				const ctx = canvas.getContext('2d')
				if (!ctx) {
					URL.revokeObjectURL(url)
					return reject('Canvas unavailable')
				}

				ctx.drawImage(img, 0, 0)
				ctx.fillStyle = 'black'
				ctx.fillRect(0, 0, img.width, 68)

				const label = snow ? 'SNOW REMOVAL - ' : 'GRASS CUT - '
				const timestamp = new Date().toLocaleString()

				ctx.font = '48px Arial'
				ctx.fillStyle = 'red'
				ctx.textBaseline = 'top'
				ctx.fillText(label + timestamp, 10, 10)

				canvas.toBlob((blob) => {
					URL.revokeObjectURL(url)
					if (!blob) return reject('Blob failed')

					resolve(new File([blob], file.name, { type: file.type }))
				}, file.type)
			}

			img.onerror = () => reject('Image load failed')
			img.src = url
		})
	}

	/* --------------------------------------------
	   UI GUARDS
	-------------------------------------------- */
	if (hasCamera === null) {
		return <div className="border p-4 text-center">Checking camera…</div>
	}

	if (!hasCamera) {
		return (
			<div className="border p-4 text-center">Camera access required</div>
		)
	}

	/* --------------------------------------------
	   RENDER
	-------------------------------------------- */
	return (
		<div className="space-y-4">
			{/* Hidden live camera */}
			{cameraOpen && (
				<video
					className="border rounded-sm"
					muted
					playsInline
					ref={videoRef}
				/>
			)}

			{!cameraOpen && (
				<Button
					className="w-full"
					onClick={openCamera}
					variant={'outline'}
				>
					📸 Open Camera
				</Button>
			)}

			{cameraOpen && (
				<Button
					className="w-full"
					onClick={() => setCameraOpen(false)}
					variant={'destructive'}
				>
					📸 Close Camera
				</Button>
			)}

			{cameraOpen && (
				<Button
					className="w-full"
					onClick={takePhoto}
					variant="outline"
				>
					📷 Take Photo
				</Button>
			)}

			{cameraOpen && (
				<Button
					className="w-full"
					onClick={() => setCameraOpen(false)}
					variant={'destructive'}
				>
					📸 Close Camera
				</Button>
			)}

			{images.map((img, i) => (
				<Image
					alt="Serviced"
					height={400}
					key={i}
					src={URL.createObjectURL(img)}
					width={400}
				/>
			))}

			{images.length > 0 && (
				<Button
					disabled={isPending}
					onClick={() =>
						mutate({ addressId, date: serviceDate, snow, images })
					}
					variant="outline"
				>
					Mark Yard Serviced {isPending && <Spinner />}
				</Button>
			)}

			{isError && <p className="text-red-500">{error.message}</p>}
		</div>
	)
}
