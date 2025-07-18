import { useState, useEffect } from "react";

export const useGeocode = (address: string) => {
    const [coordinates, setCoordinates] = useState({ lat: 59.95, lng: 30.33 });
    const [zoom, setZoom] = useState(11);
    const [error, setError] = useState("");

    useEffect(() => {
        const geocodeAddress = async () => {
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!}`);
                const data = await response.json();
                if (data.results.length > 0) {
                    setCoordinates({
                        lat: data.results[0].geometry.location.lat,
                        lng: data.results[0].geometry.location.lng,
                    });
                    setZoom(15);
                } else {
                    setError('Geocode was not successful');
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };
        geocodeAddress();
    }, [address]);

    return { coordinates, zoom, error };
};

export default useGeocode;