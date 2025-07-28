'use client';
import { fetchGeocode } from '@/lib/geocode';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface MapComponentProps {
  addresses: string[];
}

interface Location {
  lat: number;
  lng: number;
}

interface GeocodeResult {
  coordinates: Location;
  error?: string;
  zoom?: number;
}

// Match the actual return type of fetchGeocode based on error messages
type FetchGeocodeResult =
  | {
      coordinates: Location;
      zoom: number;
      error: boolean;
    }
  | {
      error: string | boolean;
      coordinates?: never;
      zoom?: never;
    };

export default function ManyPointsMap({ addresses }: MapComponentProps) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (error) {
        console.error('Geolocation error:', error);
      }
    };
    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchGeocodes = async () => {
      try {
        const results = await Promise.all(addresses.map(fetchGeocode));
        // Filter valid results and convert to GeocodeResult
        const validResults = results
          .filter(
            (result): result is FetchGeocodeResult & { coordinates: Location } =>
              !!result.coordinates && result.error === false
          )
          .map(
            (result): GeocodeResult => ({
              coordinates: result.coordinates,
              error: typeof result.error === 'string' ? result.error : undefined,
              zoom: result.zoom,
            })
          );
        setGeocodeResults(validResults);
        setLoading(false);
      } catch (error) {
        console.error('Geocode error:', error);
      }
    };
    fetchGeocodes();
  }, [addresses]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY) {
    return <div>Error: Google Maps API key is missing</div>;
  }

  if (!userLocation || !geocodeResults || geocodeResults.length === 0) {
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