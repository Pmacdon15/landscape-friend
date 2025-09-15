"use client";
import { CameraIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import React, { useRef } from "react";
import { useImageSelector } from "@/lib/hooks/useImageSelector";
import Spinner from "@/components/ui/loaders/spinner";
import { Client } from "@/types/clients-types";

export default function ImageSelectorMain({
  setView,
  address,
  client,
}: {
  setView: React.Dispatch<React.SetStateAction<string>>;
  address: string;
  client: Client;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    mapElementRef,
    showGeocodeSelector,
    geocodeOptions,
    handleLocationSelect,
    saveDrawing,
    backButton,
    isLoading,
  } = useImageSelector({
    setView,
    address,
    client,
    mapContainer: mapContainerRef,
  });

  return (
    <div className="relative w-full max-w-md mx-auto h-[300px]">
      {isLoading && (
        <div className="absolute inset-0 bg-white/30 flex justify-center items-center z-25 ">
          <Spinner />
        </div>
      )}
      <div className={`flex flex-nowrap absolute top-2 right-2  px-4 py-2`}>
        <button
          onClick={saveDrawing}
          className="flex gap-2 mx-2 px-4 py-2 text-white rounded bg-background hover:bg-green-500 z-25"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <CameraIcon className="w-5 h-5 text-white" />}
        </button>
        <button
          onClick={backButton}
          className="flex gap-2 mx-2 px-4 py-2 text-white rounded bg-background hover:bg-green-500 z-25"
        >
          <ArrowLeftCircleIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      <div id="map-container" ref={mapContainerRef} className={`relative w-full h-full `}>
        <div
          ref={mapElementRef}
          className="w-full h-full absolute top-0 left-0"
        />

        {showGeocodeSelector && (
          <div className="absolute top-4 left-4 bg-white shadow-md rounded max-w-md w-[90%] sm:w-[400px]">
            <h2 className="text-lg font-bold mb-2 px-4 pt-4">
              Select a Location
            </h2>
            <ul>
              {geocodeOptions ? (
                geocodeOptions.map((result, i) => {
                  const formattedAddress = result.formatted_address;
                  return (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleLocationSelect(result)}
                    >
                      {formattedAddress}
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-2 hover:bg-gray-100">
                  Address not found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
