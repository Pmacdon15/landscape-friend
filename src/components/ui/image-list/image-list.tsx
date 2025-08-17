"use client";
import { Client } from "@/types/types";
import React, { useState } from "react";
import ImageSelectorMain from "../image-selector/image-selector-main";
import AddSiteMap from "./list-view/add-site-map";
import ImageGallery from "./image-gallery";

export default function ImageList({ client }: { client: Client, }) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [view, setView] = useState<string>("list");

  return (
    <>
      {view == "map" &&
        <div className="flex flex-col gap-y-2 min-h-[300px] w-full overflow-y-auto h-[300px] bg-background rounded-md p-2 ">
          <ImageSelectorMain
            address={client.address}
            setView={setView}
            client={client}
          />
        </div>}
      {view == "list" && client.images.length === 0 &&
        <AddSiteMap
          clientId={client.id}
          setView={setView}
        />}
      {view == "add" &&
        <AddSiteMap
          clientId={client.id}
          setView={setView}
        />}
      {view == "list" && client.images.length > 0 &&
        <ImageGallery
          client={client}
          setView={setView}
          previewSrc={previewSrc}
          setPreviewSrc={setPreviewSrc}
        />}
    </>
  );
}
