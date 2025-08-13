"use client";
import { FetchAllImagesByCustomerId } from "@/DAL/dal-map-component";
import { Client } from "@/types/types";
import { ArrowLeftCircleIcon, PlusCircleIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { QueryResultRow } from "@vercel/postgres";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ImageUploader from "../image-uploader/image-uploader";
import ImageSelectorMain from "../image-selector/image-selector-main";
import { ImagePlusIcon } from "lucide-react";

export default function ImageList({ client }: { client: Client }) {
  const [urls, setUrls] = useState<QueryResultRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [view, setView] = useState<string>("list");

  useEffect(() => {
    setIsLoading(true);
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
  }, [view]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center gap-y-2 min-h-[300px] w-full overflow-y-auto h-[300px] bg-background rounded-md p-2 ">
        <div className="w-[50px] h-[50px] rounded-[50%] border-[5px] border-solid border-green-50 border-t-green-700 animate-spin"></div>
      </div>
    );

  return (
    <>
      {view == "map" && (
        <div className="flex flex-col gap-y-2 min-h-[300px] w-full overflow-y-auto h-[300px] bg-background rounded-md p-2 ">
          <ImageSelectorMain
            address={client.address}
            setview={setView}
            client={client}
          />
        </div>
      )}
      {view == "list" && urls.length == 0 && (
        <div className="flex flex-col gap-y-2 min-h-[300px] w-full overflow-y-auto h-[300px] bg-background rounded-md p-2 ">
          <div className="text-white w-full text-xl font-bold text-center my-3">
            ⚠️ No Images Saved yet !
          </div>

          <div className="flex flex-row gap-4 justify-center">
            <div className="w-[45%]">
              <button
                onClick={() => setView("map")}
                className="h-full select-none cursor-pointer w-full px-6 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out"
              >
                <div className="text-6xl">🗺️</div>
                <div>Capture from Maps</div>
              </button>
            </div>
            <ImageUploader client={client} />
          </div>
        </div>
      )}
      {view == "add" && (
        <div className="flex flex-col gap-y-2 min-h-[300px] w-full overflow-y-auto h-[300px] bg-background rounded-md p-2 ">
          <div className="text-white w-full text-xl font-bold text-center my-3">
            Upload an image!
          </div>

          <div className="flex flex-row gap-4 justify-center">
            <div className="w-[45%]">
              <button
                onClick={() => setView("map")}
                className="h-full select-none cursor-pointer w-full px-6 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-green-200 transition duration-300 ease-in-out"
              >
                <div className="text-6xl">🗺️</div>
                <div>Capture from Maps</div>
              </button>
            </div>
            <ImageUploader client={client} />
          </div>
          <div className="w-[100%]">
            <button
              onClick={() => setView("list")}
              className="select-none cursor-pointer px-6 py-2 text-2xl"
            >
              ⬅️
            </button>
          </div>
        </div>
      )}
      {view == "list" && urls.length > 0 && (
    <div className="relative w-full max-w-md mx-auto h-[300px] overflow-y-auto bg-background rounded-md p-2">
        {/* <div className="flex flex-col gap-y-2 max-h-[300px] w-full overflow-y-scroll bg-background rounded-md p-2 "> */}
          <div
            className={`flex flex-nowrap absolute top-2 right-2 z-10 px-4 py-2`}
          >
            <button
              onClick={() => setView("add")}
              className="select-none cursor-pointer px-6 py-2 bg-background rounded hover:bg-green-300"
            >
               <ImagePlusIcon className="w-5 h-5 text-white" />
            </button>
          </div>

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
      )}
      ;
    </>
  );
}
