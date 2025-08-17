"use client";
import { Client } from "@/types/types";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";
import { ImagePlusIcon } from "lucide-react";

interface ImageGalleryProps {
  isAdmin: boolean;
  client: Client;
  setView: (view: string) => void;
}

export default function ImageGallery({
  isAdmin,
  client,
  setView,
}: ImageGalleryProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  return (
    <div className="relative w-full max-w-md mx-auto h-[300px] overflow-y-auto bg-background rounded-md p-2">
      {isAdmin && <div className={`flex flex-nowrap absolute top-3 md:top-1 right-3 md:right-1 z-10 px-4 py-2`}>
        <button
          onClick={() => setView("add")}
          className="select-none cursor-pointer px-6 py-2 bg-background rounded border shadow-lg hover:bg-green-300"
        >
          <ImagePlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>}

      <div className="flex flex-wrap justify-center align-middle items-center h-full">

        {client.images?.map((url: string, index) => (
          <Image
            className="p-2 hover:cursor-zoom-in"
            key={index}
            onClick={() => { setPreviewSrc(url) }}
            src={url}
            alt={`Image ${index + 1}`}
            width={400}
            height={400}
          />
        ))}
      </div>

      {/* Fullscreen Preview */}
      {previewSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <Image
            src={previewSrc}
            alt="Full screen preview"
            fill
            className="object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-gray-800 rounded-full"
            onClick={() => setPreviewSrc(null)}
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  );
}