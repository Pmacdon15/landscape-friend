"use client";
import { Client } from "@/types/types";
import React, { useState } from "react";
import ImageSelectorMain from "../image-selector/image-selector-main";
import AddSiteMap from "./list-view/add-site-map";
import ImageGallery from "./image-gallery";
import NonAdminPlaceHolder from "./list-view/non-admin-placeholder";

export default function ImageList({ isAdmin, client }: { isAdmin: boolean, client: Client, }) {
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
      {view == "list" && client.images.length === 0 && isAdmin &&
        <AddSiteMap
          clientId={client.id}
          setView={setView}
        />
      }
      {view == "list" && client.images.length === 0 && !isAdmin &&
        <NonAdminPlaceHolder />
      }
      {view == "add" &&
        <AddSiteMap
          clientId={client.id}
          setView={setView}
        />
      }
      {view == "list" && client.images.length > 0 &&
        <ImageGallery
          client={client}
          setView={setView}
        />
      }
    </>
  );
}
