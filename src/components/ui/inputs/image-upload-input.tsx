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
				id="image-upload"
				name="image"
				onChange={handleFileChange}
				ref={fileInputRef}
				required
				type="file"
			/>

			<div className="flex flex-col items-center rounded-md border border-gray-300 bg-white px-6 py-3 shadow-sm hover:bg-green-200">
				<div className="text-6xl">📸</div>
				<div className="max-w-full px-2">{captionButtonImage}</div>
			</div>
		</>
	)
}
