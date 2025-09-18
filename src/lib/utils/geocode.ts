
export const fetchGeocode = async (address: string) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!}`);
    const data = await response.json();

    if (data.results.length > 0) {
        return {
            coordinates: {
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng,
            },
            zoom: 15,
            error: false,
        };
    } else {
        throw new Error('No results found');
    }
};
