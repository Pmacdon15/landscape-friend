'use client'
import Image from 'next/image'
import { useGetLocation } from '@/lib/hooks/hooks'
import type { MapComponentProps } from '@/types/google-map-iframe-types'
import FormHeader from '../header/form-header'
const MAX_STATIC_MARKERS = 15;

// Slice the array to include only the first 15 addresses.

export default function ManyPointsMap({ addresses }: MapComponentProps) {
  const { userLocation } = useGetLocation()

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return <div>Error: Google Maps API key is missing</div>
  }

  if (addresses.length === 0) {
    return <FormHeader>No addresses to display</FormHeader>
  }

  const addressesForStaticMap = addresses.slice(0, MAX_STATIC_MARKERS);
  
  const markers = addressesForStaticMap
    .map((addr) => `markers=size:mid%7Ccolor:red%7C${encodeURIComponent(addr)}`)
    .join('&')

  const userMarker = userLocation
    ? `&markers=size:mid%7Ccolor:blue%7C${userLocation.lat},${userLocation.lng}`
    : ''

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=500x200&maptype=roadmap${userMarker}&${markers}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`

  const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : encodeURIComponent(addresses[0])

  const MAX_WAYPOINTS = 10
  const routeChunks: { url: string; label: string }[] = []

  if (addresses.length <= MAX_WAYPOINTS) {
    const destination = encodeURIComponent(addresses[addresses.length - 1])

    const startIndex = userLocation ? 0 : 1

    const waypoints = addresses
      .slice(startIndex, -1)
      .map((addr) => encodeURIComponent(addr))
      .join('|')

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`
    routeChunks.push({
      url,
      label: `View Route (${addresses.length} stops)`,
    })
  } else {
    let currentIndex = 0
    let routeNumber = 1

    while (currentIndex < addresses.length) {
      const chunkSize = Math.min(MAX_WAYPOINTS, addresses.length - currentIndex)
      const chunk = addresses.slice(currentIndex, currentIndex + chunkSize)

      let chunkOrigin = origin

      if (currentIndex > 0) {
        chunkOrigin = encodeURIComponent(addresses[currentIndex - 1])
      }

      const destination = encodeURIComponent(chunk[chunk.length - 1])

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
        alt="Map of un-serviced yards"
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