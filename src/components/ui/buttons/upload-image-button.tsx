'use client'
import { use } from 'react'
import { toast } from 'sonner'
import { useUploadImage } from '@/lib/mutations/mutations'
import Spinner from '../loaders/spinner'

export default function UploadImageButton({
	addressId,
	setView,
	pagePromise,
}: {
	addressId: number
	setView: React.Dispatch<React.SetStateAction<string>>
	pagePromise: Promise<number>
}) {
	const page = use(pagePromise)
	const { mutate, isPending } = useUploadImage({
		onSuccess: () => {
			toast.success('Image uploaded successfully!', {
				duration: 1500,
			})
			setView('list')
		},
		onError: (error) => {
			console.error('Upload failed:', error)
			toast.error('Image upload failed!', { duration: 1500 })
		},
		page,
	})
	return (
		<button
			className={`rounded-md px-6 py-3 font-semibold text-white shadow-md ${
				isPending
					? 'cursor-not-allowed bg-green-400'
					: 'bg-background hover:bg-green-500'
			}`}
			disabled={isPending}
			formAction={(formData: FormData) => {
				mutate({ addressId, formData })
			}}
			type="submit"
		>
			{isPending ? (
				<div className="flex justify-center md:gap-8">
					Uploading...
					<Spinner />
				</div>
			) : (
				'Upload'
			)}
		</button>
	)
}
