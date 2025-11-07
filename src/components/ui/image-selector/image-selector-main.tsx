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
		<div className="relative mx-auto h-[300px] w-full max-w-md">
			{isLoading && (
				<div className="absolute inset-0 z-25 flex items-center justify-center bg-white/30">
					<Spinner />
				</div>
			)}
			<div
				className={`absolute top-2 right-2 flex flex-nowrap px-4 py-2`}
			>
				<button
					className="z-25 mx-2 flex gap-2 rounded bg-background px-4 py-2 text-white hover:bg-green-500"
					disabled={isLoading}
					onClick={saveDrawing}
					type="button"
				>
					{isLoading ? (
						<Spinner />
					) : (
						<CameraIcon className="h-5 w-5 text-white" />
					)}
				</button>
				<button
					className="z-25 mx-2 flex gap-2 rounded bg-background px-4 py-2 text-white hover:bg-green-500"
					onClick={backButton}
					type="button"
				>
					<ArrowLeftCircleIcon className="h-5 w-5 text-white" />
				</button>
			</div>

			<div
				className={`relative h-full w-full`}
				id="map-container"
				ref={mapContainerRef}
			>
				<div
					className="absolute top-0 left-0 h-full w-full"
					ref={mapElementRef}
				/>

				{showGeocodeSelector && (
					<div className="absolute top-4 left-4 w-[90%] max-w-md rounded bg-white shadow-md sm:w-[400px]">
						<h2 className="mb-2 px-4 pt-4 font-bold text-lg">
							Select a Location
						</h2>
						<ul>
							{geocodeOptions ? (
								geocodeOptions.map((result, _i) => {
									const formattedAddress =
										result.formatted_address
									return (
										<li key={result.place_id}>
											<button
												className="px-4 py-2 hover:bg-gray-100"
												onClick={() =>
													handleLocationSelect(result)
												}
												type="button"
											>
												{formattedAddress}
											</button>
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
