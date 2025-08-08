"use client";
import { useState } from "react";
import ImageList from "../image-list/image-list";
import ImageUploader from "../image-uploader/image-uploader";
import { Client } from "@/types/types";
import ImageSelectorMain from "../image-selector/image-selector-main";

export default function Tabs({ client }: { client: Client }) {
  const tabsNames = ["List Images", "Select Area", "Upload Image"];
  const [tabSelected, setTabSelected] = useState(tabsNames[0]);

  return (
    <div className="m-2 w-full overflow-y-auto h-[400px]">
      <div className="flex gap-1">
        {tabsNames.map((tabName) => (
          <div
            onClick={() => setTabSelected(tabName)}
            key={tabName}
            className={`rounded-t-sm py-2 px-4 selected-none cursor-pointer font-bold text-white ${
              tabName == tabSelected ? "bg-background" : "bg-green-400"
            }`}
          >
            {tabName}
          </div>
        ))}
      </div>
      <div className="bg-background rounded-b-md p-1">
        {
          tabSelected == tabsNames[0]
           && <ImageList client={client} />
        }
        {tabSelected == tabsNames[1] && (
          <ImageSelectorMain client={client} address={client.address} />
        )}
        {tabSelected == tabsNames[2] && <ImageUploader client={client} />}
      </div>
    </div>
  );
}
