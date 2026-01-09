import { Suspense } from 'react'
import UploadImageButton from '../buttons/upload-image-button'
import ImageUploadInput from '../inputs/image-upload-input'

export default function ImageUploader({
	addressId,
	setView,
	pagePromise,
}: {
	addressId: number
	setView: React.Dispatch<React.SetStateAction<string>>
	pagePromise: Promise<number>
}) {
	return (
		<form className="w-[45%]">
			<label
				className="flex w-full cursor-pointer flex-col gap-2"
				htmlFor={`image-upload-${addressId}`}
			>
				<ImageUploadInput addressId={addressId} />
				<Suspense>
					<UploadImageButton
						addressId={addressId}
						pagePromise={pagePromise}
						setView={setView}
					/>
				</Suspense>
			</label>
		</form>
	)
}
