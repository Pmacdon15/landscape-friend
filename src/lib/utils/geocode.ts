export async function fetchGeocode(address: string) {
	try {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY!}`,
			{ next: { revalidate: 3600 } },
		)
		const data = await response.json()
		if (data.results.length > 0) {
			return {
				coordinates: {
					lat: data.results[0].geometry.location.lat,
					lng: data.results[0].geometry.location.lng,
				},
				zoom: 15,
				error: false,
			}
		} else {
			return { error: 'No results found' }
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error getting cords...')
			return { error: error.message }
		}
		return { error: true }
	}
}
