import UploadImageButton from '../buttons/upload-image-button'
import ImageUploadInput from '../inputs/image-upload-input'

export default function ImageUploader({
	clientId,
	setView,
	page
}: {
	clientId: number
	setView: React.Dispatch<React.SetStateAction<string>>
	page:number
}) {
	return (
		<form className="w-[45%]">
			<label
				className="flex w-full cursor-pointer flex-col gap-2"
				htmlFor="image-upload"
			>
				<ImageUploadInput />
				<UploadImageButton clientId={clientId} page={page} setView={setView} />
			</label>
		</form>
	)
}
