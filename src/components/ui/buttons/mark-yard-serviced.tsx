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
	const fileInputRef = useRef<HTMLInputElement>(null)

	/* --------------------------------------------
	   DEVICE CHECKS
	-------------------------------------------- */
	function isMobileDevice() {
		return /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
	}

	useEffect(() => {
		async function checkCamera() {
			if (!navigator.mediaDevices?.enumerateDevices) {
				setHasCamera(false)
				return
			}

			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				})

				stream.getTracks().forEach((t) => {
					t.stop()
				})

				const devices = await navigator.mediaDevices.enumerateDevices()
				const hasVideoInput = devices.some(
					(device) => device.kind === 'videoinput',
				)

				setHasCamera(hasVideoInput)
			} catch (err) {
				console.error('Camera check failed', err)
				setHasCamera(false)
			}
		}

		checkCamera()
	}, [])

	/* --------------------------------------------
	   VIDEO → IMAGE FRAME
	-------------------------------------------- */
	const extractFrameFromVideo = async (videoFile: File): Promise<File> => {
		return new Promise((resolve, reject) => {
			const video = document.createElement('video')
			const videoUrl = URL.createObjectURL(videoFile)

			video.src = videoUrl
			video.muted = true
			video.playsInline = true

			video.onloadeddata = () => {
				video.currentTime = 0.5
			}

			video.onseeked = () => {
				const canvas = document.createElement('canvas')
				canvas.width = video.videoWidth
				canvas.height = video.videoHeight

				const ctx = canvas.getContext('2d')
				if (!ctx) {
					URL.revokeObjectURL(videoUrl)
					return reject('Canvas unavailable')
				}

				ctx.drawImage(video, 0, 0)

				canvas.toBlob((blob) => {
					URL.revokeObjectURL(videoUrl) // 🔥 cleanup video immediately

					if (!blob) return reject('Frame capture failed')

					resolve(
						new File([blob], `frame-${Date.now()}.jpg`, {
							type: 'image/jpeg',
						}),
					)
				}, 'image/jpeg')
			}

			video.onerror = () => {
				URL.revokeObjectURL(videoUrl)
				reject('Video load failed')
			}
		})
	}

	/* --------------------------------------------
	   TIMESTAMP OVERLAY
	-------------------------------------------- */
	const addTimestampToImage = async (file: File): Promise<File> => {
		const img = document.createElement('img')
		const imageUrl = URL.createObjectURL(file)

		return new Promise((resolve, reject) => {
			img.onload = () => {
				const canvas = document.createElement('canvas')
				canvas.width = img.width
				canvas.height = img.height

				const ctx = canvas.getContext('2d')
				if (!ctx) {
					URL.revokeObjectURL(imageUrl)
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
					URL.revokeObjectURL(imageUrl) // 🔥 cleanup image URL

					if (!blob) return reject('Blob failed')

					resolve(new File([blob], file.name, { type: file.type }))
				}, file.type)
			}

			img.onerror = () => {
				URL.revokeObjectURL(imageUrl)
				reject('Image load failed')
			}

			img.src = imageUrl
		})
	}

	/* --------------------------------------------
	   HANDLE VIDEO CAPTURE
	-------------------------------------------- */
	async function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
		const videoFile = e.target.files?.[0]
		if (!videoFile) return

		const frame = await extractFrameFromVideo(videoFile)

		const compressed =
			frame.size / 1024 / 1024 > 1
				? await imageCompression(frame, {
						maxSizeMB: 1,
						maxWidthOrHeight: 1920,
					})
				: frame

		const stamped = await addTimestampToImage(compressed)

		setImages((prev) => [...prev, stamped])

		// 🔥 delete video reference so it’s gone immediately
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	/* --------------------------------------------
	   UI GUARDS
	-------------------------------------------- */
	if (!isMobileDevice()) {
		return (
			<div className="rounded-md border p-4 text-center">
				Mobile device required
			</div>
		)
	}

	if (hasCamera === null) {
		return (
			<div className="rounded-md border p-4 text-center">
				Checking camera availability…
			</div>
		)
	}

	if (hasCamera === false) {
		return (
			<div className="rounded-md border p-4 text-center">
				Camera access required to complete service
			</div>
		)
	}

	/* --------------------------------------------
	   RENDER
	-------------------------------------------- */
	return (
		<>
			<label>
				<input
					accept="video/*"
					capture
					className="hidden"
					onChange={handleVideoChange}
					ref={fileInputRef}
					type="file"
				/>

				<div className="flex flex-col items-center rounded-md border bg-white px-6 py-3 shadow-sm hover:bg-green-200">
					<div className="text-4xl">🎥</div>
					<div>
						{images.length === 0
							? 'Record service video'
							: 'Add another'}
					</div>
				</div>
			</label>

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
		</>
	)
}
