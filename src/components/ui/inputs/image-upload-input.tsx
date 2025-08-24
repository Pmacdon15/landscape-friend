'use client'
import { useRef, useState } from "react";

export default function ImageUploadInput() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [captionButtonImage, setCaptionButtonImage] = useState("Select Image");
    // console.log("File: ", file)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
            setCaptionButtonImage(selectedFile.name);
        } else {
            setCaptionButtonImage("Select Image");
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="flex flex-col items-center select-none px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out">
                <div className="text-6xl">📸</div>
                <div className="px-2 max-w-full truncate">
                    {captionButtonImage}
                </div>
            </div>
        </>
    );
}