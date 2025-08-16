"use client";
import { useUploadImage } from "@/mutations/mutations";
import { Client } from "@/types/types";
import { useRef, useState } from "react";

export default function ImageUploader({ client, setView }: { client: Client, setView: React.Dispatch<React.SetStateAction<string>> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [captionButtonImage, setCaptionButtonImage] = useState("Select Image");
  const { mutate, isPending } = useUploadImage({
    onSuccess: () => {
      setView("list")
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    }
  });

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
    <form action={(formData: FormData) => {
      mutate({ clientId: client.id, formData });
    }}
      className="w-[45%]">
      <label className="cursor-pointer relative flex flex-col w-full">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          name="file"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center select-none px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out">
          <div className="text-6xl">📸</div>
          <div className="px-2 max-w-full truncate">
            {captionButtonImage}
          </div>

          <button
            type="submit"
            disabled={!file || isPending}
            className={`px-6 py-3 rounded-md shadow-md text-white font-semibold transition duration-300 ease-in-out ${!file || isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-background hover:bg-green-500"
              }`}
          >
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </div>
      </label>
    </form>
  );
}
