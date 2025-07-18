import { fetchGeocode } from "@/lib/geocode";
import { Suspense } from "react";

interface MapComponentProps {
    address: string;
}

export default async function MapComponent({ address }: MapComponentProps) {
    const result = await fetchGeocode(address);

    if (result.error) {
        return <div>Error: {result.error}</div>;
    }

    const { coordinates, zoom } = result;

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}&q=${coordinates?.lat},${coordinates?.lng}&zoom=${zoom}`;

    return (
        <Suspense fallback={ <div className="flex flex-col md:flex-row w-full ">Loading...</div>}>
            <div className="flex flex-col md:flex-row w-full ">
                <iframe
                    title="Map View"
                    src={mapUrl}
                    className="md:w-1/2 w-full h-[200px]"
                />
            </div>
        </Suspense>
    );
}