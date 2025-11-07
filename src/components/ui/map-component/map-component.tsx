import { fetchGeocode } from '@/lib/utils/geocode'

export default async function MapComponent({ address }: { address: string }) {
	const result = await fetchGeocode(address)

	if (result.error) {
		return <div>Error: {result.error}</div>
	}

	const { coordinates, zoom } = result

	const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${coordinates?.lat},${coordinates?.lng}&zoom=${zoom}`

	return (
		<div className="flex max-h-[300px] w-full flex-col rounded-md bg-background p-2 md:flex-row">
			<iframe className="h-full w-full" src={mapUrl} title="Map View" />
		</div>
	)
}
