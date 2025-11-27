'use client'

import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api'
import FormHeader from '../header/form-header'

// --- 1. Define and Export the Prop Types ---

// A helper function to safely check if a coordinate value is a valid, finite number
const isValidCoordinate = (value: number | undefined): value is number =>
	typeof value === 'number' && isFinite(value) && value !== null

// The structure for a single address point (with pre-geocoded coordinates)
interface AddressPoint {
	address: string
	lat: number
	lng: number
}

// The structure for the user's location
interface UserLocation {
	lat: number
	lng: number
}

// The unified type for map markers (icon is optional)
interface CustomMarker {
	id: string | number
	position: { lat: number; lng: number }
	title: string
	icon?: string
}

// The main component props type
export interface MapComponentProps {
	addresses: AddressPoint[]
	// Assuming useGetLocation returns an object matching UserLocation or null
	userLocation: UserLocation | null
}
// -------------------------------------------

const containerStyle = {
	width: '100%',
	height: '400px', // Increased height for better visibility
}

// Libraries array should be defined outside the component to prevent reload warnings
const LIBRARIES: ('places' | 'drawing' | 'geometry' | 'visualization')[] = [
	'places', // Add common libraries needed
]

// Apply the MapComponentProps type
export default function ManyPointsMap({
	addresses,
	userLocation,
}: MapComponentProps) {
	if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
		return <div>Error: Google Maps API key is missing</div>
	}

	if (addresses.length === 0) {
		return <FormHeader>No addresses to display</FormHeader>
	}

	// --- 2. Calculate Safe Map Center (Fixes setCenter InvalidValueError) ---

	let centerLat = 0
	let centerLng = 0
	let isCenterValid = false

	// 1. Try to use user location
	if (
		userLocation &&
		isValidCoordinate(userLocation.lat) &&
		isValidCoordinate(userLocation.lng)
	) {
		centerLat = userLocation.lat
		centerLng = userLocation.lng
		isCenterValid = true
	}
	// 2. Otherwise, try to use the first address's coordinates
	else if (
		addresses.length > 0 &&
		isValidCoordinate(addresses[0].lat) &&
		isValidCoordinate(addresses[0].lng)
	) {
		centerLat = addresses[0].lat
		centerLng = addresses[0].lng
		isCenterValid = true
	}

	// Set a safe fallback center (e.g., a known, reliable coordinate)
	const defaultCenter = isCenterValid
		? { lat: centerLat, lng: centerLng }
		: { lat: 34.0522, lng: -118.2437 } // Example fallback to Los Angeles, CA

	// --- 3. Prepare Marker Data (Fixes setPosition InvalidValueError) ---

	// Create markers from addresses, only including those with valid coordinates
	const addressMarkers: CustomMarker[] = addresses
		.filter(
			(addr) =>
				isValidCoordinate(addr.lat) && isValidCoordinate(addr.lng),
		)
		.map((addr: AddressPoint, index: number) => ({
			id: index,
			position: { lat: addr.lat, lng: addr.lng },
			title: addr.address,
		}))

	// Build the array of all markers, including the optional user marker.
	let allMarkers: CustomMarker[] = addressMarkers

	if (
		userLocation &&
		isValidCoordinate(userLocation.lat) &&
		isValidCoordinate(userLocation.lng)
	) {
		// Prepend user marker if location is valid
		allMarkers = [
			{
				id: 'user-location',
				position: { lat: userLocation.lat, lng: userLocation.lng },
				title: 'Your Location',
				icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // A standard blue pin URL
			},
			...addressMarkers,
		]
	}

	return (
		// LoadScript usage is corrected (removed invalid 'as' and 'string' props)
		<LoadScript
			googleMapsApiKey={
				process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
			}
			libraries={LIBRARIES}
		>
			<GoogleMap
				center={defaultCenter}
				mapContainerStyle={containerStyle}
				zoom={10}
				// You might want to use the 'options' prop to set default map options
			>
				{/* Render only the markers that passed the coordinate checks */}
				{allMarkers.map((marker) => (
					<MarkerF
						icon={marker.icon}
						key={marker.id}
						position={marker.position}
						title={marker.title}
					/>
				))}
			</GoogleMap>
		</LoadScript>
	)
}
