'use client'
import { useGetLocation } from '@/lib/hooks/hooks'
import type { MapComponentProps } from '@/types/google-map-iframe-types'
import { useLoadScript } from '@react-google-maps/api'
import FormHeader from '../header/form-header'
import { useEffect, useRef } from 'react'

const libraries: ('places' | 'drawing' | 'geometry')[] = ['places']

export default function ManyPointsMap({ addresses }: MapComponentProps) {
  const { userLocation } = useGetLocation()
  const mapRef = useRef<HTMLDivElement>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  })

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 12,
      })

      addresses.forEach((address) => {
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results) {
            const icon = document.createElement('img');
            icon.src = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';

            new google.maps.marker.AdvancedMarkerElement({
              map,
              position: results[0].geometry.location,
              content: icon,
            })
          } else {
            console.error('Geocode was not successful for the following reason:', status)
          }
        })
      })

      if (userLocation) {
        const icon = document.createElement('img');
        icon.src = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';

        new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: userLocation.lat, lng: userLocation.lng },
          content: icon,
        })
      }
    }
  }, [isLoaded, addresses, userLocation])

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return <div>Error: Google Maps API key is missing</div>
  }

  if (addresses.length === 0) {
    return <FormHeader>No addresses to display</FormHeader>
  }

  if (loadError) {
    return <div>Error loading maps</div>
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

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

  return (
    <div className="relative">
      <div
        ref={mapRef}
        style={{ height: '200px', width: '100%' }}
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