// 'use client'

// import { useFetchGeocode } from '@/lib/hooks/hooks'

export default function MapComponent({ address }: { address: string }) {
	
	const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${address}`

	return (
		<div className="flex max-h-[300px] w-full flex-col rounded-md bg-background p-2 md:flex-row">
			<iframe className="h-full w-full" src={mapUrl} title="Map View" />
		</div>
	)
}
