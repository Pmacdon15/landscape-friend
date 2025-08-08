"use client";
import { FetchAllImagesByCustomerId } from "@/DAL/dal-map-component";
import { Client } from "@/types/types";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { QueryResultRow } from "@vercel/postgres";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function ImageList({ client }: { client: Client }) {
  const [urls, setUrls] = useState<QueryResultRow[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    async function getUrls() {
      try {
        const result = await FetchAllImagesByCustomerId(client.id);
        if (result instanceof Error) {
          console.error(result);
        } else {
          setUrls(result);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getUrls();
  }, []);


  if(isLoading) return <div>Loading. . . </div>


  return (
    <div className="min-h-[300px] h-full">
      {urls?.map((url: QueryResultRow, index) => (
        <Image
          className="p-2 hover:cursor-zoom-in"
          key={index}
          onClick={() => setPreviewSrc(url.imageurl)}
          src={url.imageurl}
          alt={`Image ${index + 1}`}
          width={400}
          height={400}
        />
      ))}

      {/* Fullscreen Preview */}
      {previewSrc && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50">
          <Image
            src={previewSrc}
            alt="Full screen preview"
            width={600}
            height={600}
            className="max-w-full object-cover max-h-full"
            onClick={() => setPreviewSrc(null)}
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
