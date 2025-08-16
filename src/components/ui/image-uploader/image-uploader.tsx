"use client";
import { uploadImage } from "@/actions/blobs";
import { Client } from "@/types/types";
import { useRef, useState } from "react";

export default function ImageUploader({ client }: { client: Client }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [captionButtonImage, setCaptionButtonImage] = useState("Select Image");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setCaptionButtonImage(selectedFile.name);
    } else {
      setCaptionButtonImage("Select Image");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const result = await uploadImage(client.id, file);
      if (!result) {
        console.log(result)
        throw new Error("error Fetching Image image")
      }
      // After upload, clear input and filename
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setCaptionButtonImage("📸 Select Image");
      setFile(null);

      alert("Upload success!");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-[45%]">
      <label className="cursor-pointer relative flex flex-col w-full">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center select-none px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out">
          <div className="text-6xl">📸</div>
          <div className="px-2 max-w-full truncate">
            {captionButtonImage}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-6 py-3 rounded-md shadow-md text-white font-semibold transition duration-300 ease-in-out ${uploading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-background hover:bg-green-500"
              }`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </label>
    </div>
  );
}
