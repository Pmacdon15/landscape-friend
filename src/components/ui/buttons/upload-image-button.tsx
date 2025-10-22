'use client'
import { toast } from 'sonner'
import { useUploadImage } from '@/lib/mutations/mutations'
import Spinner from '../loaders/spinner'

export default function UploadImageButton({
	clientId,
	setView,
}: {
	clientId: number
	setView: React.Dispatch<React.SetStateAction<string>>
}) {
	const { mutate, isPending } = useUploadImage({
		onSuccess: () => {
			toast.success('Image uploaded successfully!', { duration: 1500 })
			setView('list')
		},
		onError: (error) => {
			console.error('Upload failed:', error)
			toast.error('Image upload failed!', { duration: 1500 })
		},
	})
	return (
		<button
			className={`px-6 py-3 rounded-md shadow-md text-white font-semibold  ${
				isPending
					? 'bg-green-400 cursor-not-allowed'
					: 'bg-background hover:bg-green-500'
			}`}
			disabled={isPending}
			formAction={(formData: FormData) => {
				mutate({ clientId: clientId, formData })
			}}
			type="submit"
		>
			{isPending ? (
				<div className="flex md:gap-8 justify-center">
					Uploading...
					<Spinner />
				</div>
			) : (
				'Upload'
			)}
		</button>
	)
}
