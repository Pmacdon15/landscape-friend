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
	const { geocodeResults } = useGetLonAndLatFromAddresses(addresses)


	if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
		return <div>Error: Google Maps API key is missing</div>
	}

	// If we have no addresses at all, show a message
	if (addresses.length === 0) {
		return <FormHeader>No addresses to display</FormHeader>
	}

	// Determine if we are using geocoded results or falling back to raw addresses
	const useGeocoded = geocodeResults.length > 0
	const validAddresses = useGeocoded
		? geocodeResults.map((r) => r.address)
		: addresses

	// Generate markers
	const markers = useGeocoded
		? geocodeResults
				.map((result: GeocodeResult) => {
					const { coordinates } = result
					return `markers=size:mid%7Ccolor:red%7C${coordinates.lat},${coordinates.lng}`
				})
				.join('&')
		: addresses
				.map(
					(addr) =>
						`markers=size:mid%7Ccolor:red%7C${encodeURIComponent(addr)}`,
				)
				.join('&')

	// Only add user marker if we have user location
	const userMarker = userLocation
		? `&markers=size:mid%7Ccolor:blue%7C${userLocation.lat},${userLocation.lng}`
		: ''

	// We remove center and zoom to let Google Maps auto-fit all markers
	const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=500x200&maptype=roadmap${userMarker}&${markers}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`

	const origin = userLocation
		? `${userLocation.lat},${userLocation.lng}`
		: encodeURIComponent(validAddresses[0])

	// Google Maps URL API has a limit of 10 waypoints
	// Split routes into chunks if there are more than 10 stops
	const MAX_WAYPOINTS = 10
	const routeChunks: { url: string; label: string }[] = []

	// If we have 10 or fewer addresses, create a single route
	if (validAddresses.length <= MAX_WAYPOINTS) {
		const destination = encodeURIComponent(
			validAddresses[validAddresses.length - 1],
		)

		// If using user location, we include all addresses as waypoints (except destination)
		// If using first address as origin, we skip the first address in waypoints
		const startIndex = userLocation ? 0 : 1

		const waypoints = validAddresses
			.slice(startIndex, -1)
			.map((addr) => encodeURIComponent(addr))
			.join('|')

		const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`
		routeChunks.push({
			url,
			label: `View Route (${validAddresses.length} stops)`,
		})
	} else {
		// Split into multiple routes
		let currentIndex = 0
		let routeNumber = 1

		while (currentIndex < validAddresses.length) {
			// Take up to MAX_WAYPOINTS addresses for this chunk
			const chunkSize = Math.min(
				MAX_WAYPOINTS,
				validAddresses.length - currentIndex,
			)
			const chunk = validAddresses.slice(
				currentIndex,
				currentIndex + chunkSize,
			)

			// For the first chunk:
			// - If user location exists, use it as origin
			// - If no user location, use first address as origin (handled by origin variable above)
			// For subsequent chunks, use the last stop of previous chunk as origin
			let chunkOrigin = origin

			if (currentIndex > 0) {
				chunkOrigin = encodeURIComponent(
					validAddresses[currentIndex - 1],
				)
			} else if (!userLocation) {
				// If no user location and this is first chunk, origin is already set to first address
				// But we need to make sure we don't include the origin in the waypoints/destination if it's the same
				// actually the logic below handles waypoints from the chunk
			}

			const destination = encodeURIComponent(chunk[chunk.length - 1])

			// If this is the first chunk and we're using first address as origin,
			// we need to exclude the first address from waypoints
			let waypointsChunk = chunk.slice(0, -1)
			if (currentIndex === 0 && !userLocation) {
				waypointsChunk = chunk.slice(1, -1)
			}

			const waypoints = waypointsChunk
				.map((addr) => encodeURIComponent(addr))
				.join('|')

			const url = `https://www.google.com/maps/dir/?api=1&origin=${chunkOrigin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`

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

	console.log('Generated Route Chunks:', routeChunks)

	return (
		<div className="relative">
			<Image
				alt="Map of unserviced yards"
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
							className="whitespace-nowrap rounded bg-blue-500 px-2 py-1 font-bold text-white text-xs hover:bg-blue-700"
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
