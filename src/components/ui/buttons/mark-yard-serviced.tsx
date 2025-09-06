"use client";
import { useMarkYardServiced } from "@/lib/mutations/mutations";
import { Button } from "../button";
import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import Image from "next/image";

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

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

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
  if (!isMobileDevice())
    return (
      <div className="flex flex-col items-center select-none px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out">
        <h1>Device not supported for complete services</h1>
      </div>
    );
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
            <div className="px-2 max-w-full truncate">
              Take a photo to complete the service
            </div>
          </div>
        </label>
      )}
      {image && (
        <>
          {image && (
            <Image
              width={400}
              height={400}
              src={URL.createObjectURL(new Blob([image]))}
              alt={"Site Serviced Photo"}
            />
          )}

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
