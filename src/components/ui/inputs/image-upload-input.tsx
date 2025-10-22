'use client'
import { useRef, useState } from 'react'

export default function ImageUploadInput() {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [file, setFile] = useState<File | null>(null)
	const [captionButtonImage, setCaptionButtonImage] = useState('Select Image')
	console.log('File: ', file)
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0]

		if (selectedFile) {
			setFile(selectedFile)
			setCaptionButtonImage(selectedFile.name)
		} else {
			setCaptionButtonImage('Select Image')
		}
	}

	return (
		<>
			<input
				accept="image/*"
				className="hidden"
				name="image"
				onChange={handleFileChange}
				ref={fileInputRef}
				required
				type="file"
			/>

			<div className="flex flex-col items-center  px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 ">
				<div className="text-6xl">📸</div>
				<div className="px-2 max-w-full ">{captionButtonImage}</div>
			</div>
		</>
	)
}
