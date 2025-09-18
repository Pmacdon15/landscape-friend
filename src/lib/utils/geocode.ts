export async function fetchGeocode(address: string) {
    try {
        const response = await fetch(` https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${process.env.GEO_CODE_API}`, { next: { revalidate: 3600 } });        
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
            return { error: 'No results found' };
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error getting cords...");
            return { error: error.message };
        }
        return { error: true };
    }
}