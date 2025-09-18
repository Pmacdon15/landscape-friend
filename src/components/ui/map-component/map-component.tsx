'use client';

import { useGeocode } from '@/lib/hooks/hooks';

export default function MapComponent({ address }: { address: string }) {
    const { data, error, isLoading } = useGeocode(address);

    if (isLoading) {
        return <div className="w-full text-center">Loading map...</div>;
    }

    if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Could not load map.';
        return <div className="w-full text-center">Error: {errorMessage}</div>;
    }

    if (!data || !data.coordinates) {
        return <div className="w-full text-center">Error: No coordinates found for the address.</div>;
    }

    const { coordinates, zoom } = data;

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}&q=${coordinates.lat},${coordinates.lng}&zoom=${zoom}`;

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
