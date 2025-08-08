"use client"
import { FetchUploadImage } from "@/DAL/dal-map-component";
import { Client } from "@/types/types";
import { useState } from "react";

export default function ImageUploader({ client }: { client: Client }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const result = await FetchUploadImage(client.id , file) ;
      alert("Upload success!");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full h-[500px] bg-green-100 rounded-lg shadow-lg p-6 flex flex-col justify-center items-center space-y-6">
      <label className="cursor-pointer relative flex flex-col w-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          capture 
        />

        <div className="px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out">
          📸 Select Image
        </div>
      </label>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`px-6 py-3 rounded-md shadow-md text-white font-semibold transition duration-300 ease-in-out ${
          uploading || !file
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-background hover:bg-green-500"
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
