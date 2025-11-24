// Mock types
interface GeocodeResult {
	address: string
	coordinates: { lat: number; lng: number }
	error?: string | boolean
	zoom: number
}

// Mock data
const mockAddresses = Array.from({ length: 25 }, (_, i) => `Address ${i + 1}`)
const mockGeocodeResults: GeocodeResult[] = mockAddresses.map((addr, i) => ({
	address: addr,
	coordinates: { lat: 40 + i * 0.01, lng: -74 + i * 0.01 },
	zoom: 15,
	error: false,
}))

// Mock user location (can be null)
const userLocation = null // Simulate laptop without location
// const userLocation = { lat: 40.7128, lng: -74.0060 }; // Simulate with location

// Logic from many-points-map.tsx
function generateRoutes(
	geocodeResults: GeocodeResult[],
	userLocation: { lat: number; lng: number } | null,
) {
	const origin = userLocation
		? `${userLocation.lat},${userLocation.lng}`
		: encodeURIComponent(geocodeResults[0].address)

	const MAX_WAYPOINTS = 10
	const routeChunks: { url: string; label: string }[] = []

	if (geocodeResults.length <= MAX_WAYPOINTS) {
		// Single route logic (omitted for brevity as issue is with multiple chunks)
		console.log('Single route case')
	} else {
		let currentIndex = 0
		let routeNumber = 1

		while (currentIndex < geocodeResults.length) {
			const chunkSize = Math.min(
				MAX_WAYPOINTS,
				geocodeResults.length - currentIndex,
			)
			const chunk = geocodeResults.slice(
				currentIndex,
				currentIndex + chunkSize,
			)

			let chunkOrigin = origin

			if (currentIndex > 0) {
				chunkOrigin = encodeURIComponent(
					geocodeResults[currentIndex - 1].address,
				)
			} else if (!userLocation) {
				// Logic for first chunk without user location
			}

			const destination = encodeURIComponent(
				chunk[chunk.length - 1].address,
			)

			let waypointsChunk = chunk.slice(0, -1)
			if (currentIndex === 0 && !userLocation) {
				waypointsChunk = chunk.slice(1, -1)
			}

			const waypoints = waypointsChunk
				.map((result) => encodeURIComponent(result.address))
				.join('|')

			const url = `https://www.google.com/maps/dir/?api=1&origin=${chunkOrigin}&destination=${destination}&waypoints=optimize:true|${waypoints}&travelmode=driving`

			const startStop = currentIndex + 1
			const endStop = currentIndex + chunkSize
			routeChunks.push({
				url,
				label: `Route ${routeNumber} (Stops ${startStop}-${endStop})`,
			})

			currentIndex += chunkSize
			routeNumber++
		}
	}
	return routeChunks
}

// Run simulation
console.log('--- Simulation with NO User Location ---')
const routesNoLoc = generateRoutes(mockGeocodeResults, null)
routesNoLoc.forEach((r) => {
	console.log(`\n${r.label}`)
	console.log(`Origin: ${new URL(r.url).searchParams.get('origin')}`)
	console.log(
		`Destination: ${new URL(r.url).searchParams.get('destination')}`,
	)
	console.log(`Waypoints: ${new URL(r.url).searchParams.get('waypoints')}`)
})

console.log('\n--- Simulation WITH User Location ---')
const routesWithLoc = generateRoutes(mockGeocodeResults, {
	lat: 40.7128,
	lng: -74.006,
})
routesWithLoc.forEach((r) => {
	console.log(`\n${r.label}`)
	console.log(`Origin: ${new URL(r.url).searchParams.get('origin')}`)
})
