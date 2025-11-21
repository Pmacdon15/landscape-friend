'use client'
import Image from 'next/image'
import { useGetLocation, useGetLonAndLatFromAddresses } from '@/lib/hooks/hooks'
import type {
	GeocodeResult,
	MapComponentProps,
} from '@/types/google-map-iframe-types'
import FormHeader from '../header/form-header'

export default function ManyPointsMap({ addresses }: MapComponentProps) {
	const { userLocation } = useGetLocation()
	const { loading, geocodeResults } = useGetLonAndLatFromAddresses(addresses)

	if (loading) {
		return <FormHeader text="Loading . . ." />
	}

	if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
		return <div>Error: Google Maps API key is missing</div>
	}

	if (!userLocation || geocodeResults.length === 0) {
		return <div>Unable to get your location or geocode addresses</div>
	}

	// Center the map on the user's location
	const center = userLocation
	const markers = geocodeResults
		.map((result: GeocodeResult) => {
			const { coordinates } = result
			return `markers=size:mid%7Ccolor:red%7C${coordinates.lat},${coordinates.lng}`
		})
		.join('&')
	const userMarker = `markers=size:mid%7Ccolor:blue%7C${userLocation.lat},${userLocation.lng}`

	const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=&size=500x200&maptype=roadmap&${userMarker}&${markers}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`

	const origin = `${userLocation.lat},${userLocation.lng}`

	// Google Maps URL API has a limit of 10 waypoints
	// Split routes into chunks if there are more than 10 stops
	const MAX_WAYPOINTS = 10
	const routeChunks: { url: string; label: string }[] = []

	// If we have 10 or fewer addresses, create a single route
	if (geocodeResults.length <= MAX_WAYPOINTS) {
		const destination = encodeURIComponent(
			geocodeResults[geocodeResults.length - 1].address,
		)
		const waypoints = geocodeResults
			.slice(0, -1)
			.map((result: GeocodeResult) => encodeURIComponent(result.address))
			.join('|')

		const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypoints}&travelmode=driving`
		routeChunks.push({
			url,
			label: `View Route (${geocodeResults.length} stops)`,
		})
	} else {
		// Split into multiple routes
		let currentIndex = 0
		let routeNumber = 1

		while (currentIndex < geocodeResults.length) {
			// Take up to MAX_WAYPOINTS addresses for this chunk
			const chunkSize = Math.min(
				MAX_WAYPOINTS,
				geocodeResults.length - currentIndex,
			)
			const chunk = geocodeResults.slice(
				currentIndex,
				currentIndex + chunkSize,
			)

			// For the first chunk, use user location as origin
			// For subsequent chunks, use the last stop of previous chunk as origin
			const chunkOrigin =
				currentIndex === 0
					? origin
					: encodeURIComponent(
							geocodeResults[currentIndex - 1].address,
						)

			const destination = encodeURIComponent(
				chunk[chunk.length - 1].address,
			)
			const waypoints = chunk
				.slice(0, -1)
				.map((result: GeocodeResult) =>
					encodeURIComponent(result.address),
				)
				.join('|')

			const url = `https://www.google.com/maps/dir/?api=1&origin=${chunkOrigin}&destination=${destination}&waypoints=optimize:true|${waypoints}&travelmode=driving`

			const startStop = currentIndex + 1
			const endStop = currentIndex + chunkSize
			routeChunks.push({
				url,
				label: `Route ${routeNumber} (Stops ${startStop}-${endStop})`,
			})

			currentIndex += chunkSize
			routeNumber++
		}
	}

	return (
		<div className="relative">
			<Image
				alt="Map of uncut yards"
				className="h-[200px] w-full"
				height={800}
				src={mapUrl}
				title="Map View"
				width={800}
			/>
			<div className="absolute top-2 right-2 flex flex-col gap-1">
				{routeChunks.map((route, index) => (
					<a
						href={route.url}
						key={index}
						rel="noopener noreferrer"
						target="_blank"
					>
						<button
							className="rounded bg-blue-500 px-2 py-1 font-bold text-white text-xs hover:bg-blue-700 whitespace-nowrap"
							type="button"
						>
							{route.label}
						</button>
					</a>
				))}
			</div>
		</div>
	)
}
