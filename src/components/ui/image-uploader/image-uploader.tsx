import UploadImageButton from '../buttons/upload-image-button'
import ImageUploadInput from '../inputs/image-upload-input'

export default function ImageUploader({
	clientId,
	setView,
}: {
	clientId: number
	setView: React.Dispatch<React.SetStateAction<string>>
}) {
	return (
		<form className="w-[45%]">
			<label className="cursor-pointer flex flex-col w-full gap-2">
				<ImageUploadInput />
				<UploadImageButton clientId={clientId} setView={setView} />
			</label>
		</form>
	)
}
