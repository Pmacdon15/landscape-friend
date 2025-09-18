'use client'
export const fetchGeocode = (address: string) => {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'OK' && data.results.length > 0) {
                return {
                    coordinates: {
                        lat: data.results[0].geometry.location.lat,
                        lng: data.results[0].geometry.location.lng,
                    },
                    zoom: 15,
                    error: false,
                };
            } else {
                throw new Error(data.error_message || data.status || 'No results found for the address.');
            }
        });
};
