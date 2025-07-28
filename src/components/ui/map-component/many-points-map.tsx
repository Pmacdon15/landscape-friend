import { fetchGeocode } from "@/lib/geocode";

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
    return `markers=%7Ccolor:red%7C${coordinates?.lat},${coordinates?.lng}`;
  }).join('&');

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center?.lat},${center?.lng}&zoom=&size=500x200&maptype=roadmap&${markers}&key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}`;

  return (
    <div className="flex flex-col md:flex-row bg-blue-200 justify-center">
      <img
        src={mapUrl}
        title="Map View"
        alt="Map View"
        className=" w-full h-[200px]"
      />
    </div>
  );
}
