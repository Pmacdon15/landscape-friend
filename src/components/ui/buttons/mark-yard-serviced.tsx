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
	const [isRecording, setIsRecording] = useState(false)

	const videoRef = useRef<HTMLVideoElement>(null)
	const recorderRef = useRef<MediaRecorder | null>(null)
	const mediaStreamRef = useRef<MediaStream | null>(null)

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
	   FRAME EXTRACTION
	-------------------------------------------- */
	const extractFrameFromVideoBlob = async (blob: Blob): Promise<File> => {
		return new Promise((resolve, reject) => {
			const video = document.createElement('video')
			const url = URL.createObjectURL(blob)

			video.src = url
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
					URL.revokeObjectURL(url)
					return reject('Canvas unavailable')
				}

				ctx.drawImage(video, 0, 0)

				canvas.toBlob((blob) => {
					URL.revokeObjectURL(url)
					if (!blob) return reject('Frame failed')

					resolve(
						new File([blob], `frame-${Date.now()}.jpg`, {
							type: 'image/jpeg',
						}),
					)
				}, 'image/jpeg')
			}
		})
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
	   RECORD CONTROLS
	-------------------------------------------- */
	const startRecording = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: { facingMode: 'environment' },
			audio: false,
		})

		mediaStreamRef.current = stream

		if (videoRef.current) {
			videoRef.current.srcObject = stream
		}

		const recorder = new MediaRecorder(stream, {
			mimeType: 'video/webm',
		})

		const chunks: BlobPart[] = []

		recorder.ondataavailable = (e) => {
			if (e.data.size) chunks.push(e.data)
		}

		recorder.onstop = async () => {
			stream.getTracks().forEach((t) => {
				t.stop()
			})

			const blob = new Blob(chunks, { type: 'video/webm' })

			const frame = await extractFrameFromVideoBlob(blob)

			const compressed =
				frame.size / 1024 / 1024 > 1
					? await imageCompression(frame, {
							maxSizeMB: 1,
							maxWidthOrHeight: 1920,
						})
					: frame

			const stamped = await addTimestampToImage(compressed)
			setImages((prev) => [...prev, stamped])
		}

		recorder.start()
		recorderRef.current = recorder
		setIsRecording(true)
	}

	const stopRecording = () => {
		recorderRef.current?.stop()
		recorderRef.current = null
		setIsRecording(false)
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
			<video
				autoPlay
				className="w-full rounded-md border"
				muted
				playsInline
				ref={videoRef}
			/>

			<div className="flex gap-4">
				{!isRecording ? (
					<Button onClick={startRecording}>🎥 Start Recording</Button>
				) : (
					<Button onClick={stopRecording} variant="destructive">
						⏹ Stop & Capture
					</Button>
				)}
			</div>

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
