import { fetchGeocode } from "@/lib/utils/geocode";

export default async function MapComponent({ address }: { address: string }) {
  const result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}`)
    .then(response => response.json());

  if (result.error_message || !result.results || !result.results[0]) {
    return <div>Error: Unable to fetch geocode data</div>;
  }

  const { lat, lng } = result.results[0].geometry.location;
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}&q=${lat},${lng}&zoom=15`;

  return (
    <div className="flex flex-col md:flex-row w-full bg-background max-h-[300px] rounded-md p-2 ">
      <iframe
        title="Map View"
        src={mapUrl}
        className="w-full h-full"
      />
    </div>
  );
}