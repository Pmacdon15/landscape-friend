'use client';
import Image from 'next/image';
import Link from 'next/link';
import FormHeader from '../header/form-header';
import { useGetLocation, useGetLonAndLatFromAddresses } from '@/lib/hooks/hooks';
import { GeocodeResult, MapComponentProps } from '@/types/types-google-map-iframe';

export default function ManyPointsMap({ addresses }: MapComponentProps) {

  const { userLocation } = useGetLocation()
  const { loading, geocodeResults } = useGetLonAndLatFromAddresses(addresses);

  if (loading) {
    return <FormHeader text="Loading . . ." />;
  }

  if (!process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY) {
    return <div>Error: Google Maps API key is missing</div>;
  }

  if (!userLocation || geocodeResults.length === 0) {
    return <div>Unable to get your location or geocode addresses</div>;
  }

  // Center the map on the user's location
  const center = userLocation;
  const markers = geocodeResults
    .map((result: GeocodeResult) => {
      const { coordinates } = result;
      return `markers=size:mid%7Ccolor:red%7C${coordinates.lat},${coordinates.lng}`;
    })
    .join('&');
  const userMarker = `markers=size:mid%7Ccolor:blue%7C${userLocation.lat},${userLocation.lng}`;
  
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=&size=500x200&maptype=roadmap&${userMarker}&${markers}&key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}`;

  const origin = `${userLocation.lat},${userLocation.lng}`;
  const destination = `${geocodeResults[geocodeResults.length - 1].coordinates.lat},${geocodeResults[geocodeResults.length - 1].coordinates.lng}`;
  const waypoints = geocodeResults
    .slice(0, -1)
    .map((result: GeocodeResult) => `${result.coordinates.lat},${result.coordinates.lng}`)
    .join('|');

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;

  return (
    <div className="relative">
      <Image
        src={mapUrl}
        title="Map View"
        height={800}
        width={800}
        alt="Map of uncut yards"
        className="w-full h-[200px]"
      />
      <div className="absolute top-2 right-2">
        <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          <button className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded">
            View in Google Maps
          </button>
        </Link>
      </div>
    </div>
  );
}

