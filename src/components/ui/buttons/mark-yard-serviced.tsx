"use client";
import { useMarkYardServiced } from "@/lib/mutations/mutations";
import { Button } from "../button";
import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";

export default function MarkYardServiced({
  clientId,
  serviceDate,
  snow = false,
}: {
  clientId: number;
  serviceDate: Date;
  snow?: boolean;
}) {
  const { mutate, isError, isPending } = useMarkYardServiced();
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      let compressedFile = selectedFile;

      if (selectedFile.size / 1024 / 1024 > 1) {
        compressedFile = await imageCompression(selectedFile, options);
      }
      setImage(compressedFile);
    }
  }

  return (
    <>
      {isError && <p className="text-red-500">Error Marking Cut</p>}
      {!image && (
        <label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            name="image"
            onChange={handleFileChange}
            className="hidden"
            capture
            required
          />
          <div className="flex flex-col items-center select-none px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out">
            <div className="text-6xl">📸</div>
            <div className="px-2 max-w-full truncate">Take a photo to complete the service</div>
          </div>
        </label>
      )}
      {image && (
        <>
          <img width={400} src={image ? new Blob([image]) : undefined} />

          <Button
            variant={"outline"}
            onClick={() =>
              image
                ? mutate({ clientId, date: serviceDate, snow, image })
                : null
            }
            disabled={isPending}
          >
            Mark Yard Serviced
          </Button>
        </>
      )}
    </>
  );
}
