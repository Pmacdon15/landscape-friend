'use client'
import { ArrowLeftCircleIcon, CameraIcon } from '@heroicons/react/24/solid'
import type React from 'react'
import { useRef } from 'react'
import Spinner from '@/components/ui/loaders/spinner'
import { useImageSelector } from '@/lib/hooks/useImageSelector'
import type { Client } from '@/types/clients-types'

export default function ImageSelectorMain({
	setView,
	address,
	client,
}: {
	setView: React.Dispatch<React.SetStateAction<string>>
	address: string
	client: Client
}) {
	const mapContainerRef = useRef<HTMLDivElement | null>(null)
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
	})

	return (
		<div className="relative w-full max-w-md mx-auto h-[300px]">
			{isLoading && (
				<div className="absolute inset-0 bg-white/30 flex justify-center items-center z-25 ">
					<Spinner />
				</div>
			)}
			<div
				className={`flex flex-nowrap absolute top-2 right-2  px-4 py-2`}
			>
				<button
					className="flex gap-2 mx-2 px-4 py-2 text-white rounded bg-background hover:bg-green-500 z-25"
					disabled={isLoading}
					onClick={saveDrawing}
				>
					{isLoading ? (
						<Spinner />
					) : (
						<CameraIcon className="w-5 h-5 text-white" />
					)}
				</button>
				<button
					className="flex gap-2 mx-2 px-4 py-2 text-white rounded bg-background hover:bg-green-500 z-25"
					onClick={backButton}
				>
					<ArrowLeftCircleIcon className="w-5 h-5 text-white" />
				</button>
			</div>

			<div
				className={`relative w-full h-full `}
				id="map-container"
				ref={mapContainerRef}
			>
				<div
					className="w-full h-full absolute top-0 left-0"
					ref={mapElementRef}
				/>

				{showGeocodeSelector && (
					<div className="absolute top-4 left-4 bg-white shadow-md rounded max-w-md w-[90%] sm:w-[400px]">
						<h2 className="text-lg font-bold mb-2 px-4 pt-4">
							Select a Location
						</h2>
						<ul>
							{geocodeOptions ? (
								geocodeOptions.map((result, i) => {
									const formattedAddress =
										result.formatted_address
									return (
										<li
											className="px-4 py-2 hover:bg-gray-100"
											key={i}
											onClick={() =>
												handleLocationSelect(result)
											}
										>
											{formattedAddress}
										</li>
									)
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
	)
}
