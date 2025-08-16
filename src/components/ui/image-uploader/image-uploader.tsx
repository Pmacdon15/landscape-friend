"use client";
import { useUploadImage } from "@/mutations/mutations";
import { Client } from "@/types/types";
import { useRef, useState } from "react";
import ImageUploadInput from "../inputs/image-upload-input";

export default function ImageUploader({ client, setView }: { client: Client, setView: React.Dispatch<React.SetStateAction<string>> }) {

  const { mutate, isPending } = useUploadImage({
    onSuccess: () => {
      setView("list")
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    }
  });


  return (
    <form action={(formData: FormData) => {
      mutate({ clientId: client.id, formData });
    }}
      className="w-[45%]">
      <label className="cursor-pointer relative flex flex-col w-full">

        <ImageUploadInput />
        <button
          type="submit"
          disabled={isPending}
          className={`px-6 py-3 rounded-md shadow-md text-white font-semibold transition duration-300 ease-in-out ${isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-background hover:bg-green-500"
            }`}
        >
          {isPending ? "Uploading..." : "Upload"}
        </button>
      </label>
    </form >
  );
}
