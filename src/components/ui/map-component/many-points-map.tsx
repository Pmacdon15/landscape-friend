import { fetchGeocode } from "@/lib/geocode";
import Image from "next/image";
import Link from "next/link";

interface MapComponentProps {
  addresses: string[];
}

export default async function ManyPointsMap({ addresses }: MapComponentProps) {
  const geocodeResults = await Promise.all(addresses.map(fetchGeocode));

  const validResults = geocodeResults.filter(result => !result.error);

  if (validResults.length === 0) {
    return <div>Error: Unable to geocode addresses</div>;
  }

  const center = validResults[0].coordinates;
  const markers = validResults.map((result) => {
  const { coordinates } = result;
  return `markers=size:mid%7Ccolor:red%7C${coordinates?.lat},${coordinates?.lng}`;
}).join('&');

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center?.lat},${center?.lng}&zoom=&size=500x200&maptype=roadmap&${markers}&key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}`;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${center?.lat},${center?.lng}&waypoints=${validResults.map(result => `${result.coordinates?.lat},${result.coordinates?.lng}`).join('|')}`;

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