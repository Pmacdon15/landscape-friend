'use client'
import { useGeocode } from "@/lib/hooks/hooks";

export default async function MapComponent({ address }: { address: string }) {
    const { data, error } = useGeocode(address);

    if (error || !data) {
        return <div className="w-full text-center">Error: {data?.error}</div>;
    }

    // const { coordinates, zoom } = data;

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}&q=${data.coordinates?.lat},${data.coordinates?.lng}&zoom=${data.zoom}`;
    console.log("Map url: ", mapUrl)
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

