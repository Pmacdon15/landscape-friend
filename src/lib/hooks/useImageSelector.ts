import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useUploadDrawing } from '@/lib/mutations/mutations'

declare global {
	interface Window {
		google: typeof google
	}
}

export function useImageSelector({
	setView,
	address,
	addressId,
	mapContainer,
}: {
	setView: React.Dispatch<React.SetStateAction<string>>
	address: string
	addressId: number
	mapContainer: React.RefObject<HTMLDivElement | null>
}) {
	const [geocodeOptions, setGeocodeOptions] = useState<
		google.maps.GeocoderResult[] | null
	>([])
	const mapElementRef = useRef<HTMLDivElement | null>(null) // DOM node
	const mapInstanceRef = useRef<google.maps.Map | null>(null) // actual map
	const [mapCenter, setMapCenter] =
		useState<google.maps.LatLngLiteral | null>(null)
	const [mapZoom, setMapZoom] = useState<number | null>(null)
	const [showGeocodeSelector, setShowGeocodeSelector] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
		null,
	)
	const mapInitializedRef = useRef(false)
	const { mutate, isPending } = useUploadDrawing()

	const initMap = useCallback(async () => {
		if (mapInitializedRef.current) return
		if (!window.google?.maps?.Geocoder || !mapElementRef.current) return

		const geocoder = new window.google.maps.Geocoder()

		const map = new window.google.maps.Map(mapElementRef.current, {
			zoom: mapZoom ?? 20,
			mapTypeId: 'hybrid',
			tilt: 0,
			heading: 0,
			center: mapCenter,
			disableDefaultUI: true,
		})

		const drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: null,
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_LEFT,
				drawingModes: [
					google.maps.drawing.OverlayType.RECTANGLE,
					google.maps.drawing.OverlayType.POLYGON,
					google.maps.drawing.OverlayType.CIRCLE,
					google.maps.drawing.OverlayType.MARKER,
				],
			},
			circleOptions: {
				fillColor: 'rgba(255,0,0)',
				fillOpacity: 0.8,
				strokeWeight: 0,
				clickable: false,
				editable: false,
				zIndex: 1,
			},
			rectangleOptions: {
				fillColor: 'rgba(255,0,0)',
				fillOpacity: 0.8,
				strokeWeight: 0,
				clickable: false,
				editable: false,
				zIndex: 1,
			},
			polygonOptions: {
				fillColor: 'rgba(255,0,0)',
				fillOpacity: 0.8,
				strokeWeight: 0,
				clickable: false,
				editable: false,
				zIndex: 1,
			},
		})

		drawingManager.setMap(map)
		drawingManagerRef.current = drawingManager
		mapInstanceRef.current = map

		if (!mapCenter) {
			geocoder.geocode({ address }, (results, status) => {
				if (!results) {
					setGeocodeOptions(null)
					setShowGeocodeSelector(true)
				}

				if (status === 'OK' && results) {
					if (results.length === 1) {
						const location = results[0].geometry.location
						map.setCenter(location)
						setMapCenter({
							lat: location.lat(),
							lng: location.lng(),
						})
					} else {
						setGeocodeOptions(results)
						setShowGeocodeSelector(true)
					}
				}
			})
		}

		map.addListener('idle', () => {
			const center = map.getCenter()
			if (center) {
				setMapCenter({ lat: center.lat(), lng: center.lng() })
			}
			setMapZoom(map.getZoom() ?? 20)
		})
		mapInitializedRef.current = true
	}, [address, mapCenter, mapZoom])

	useEffect(() => {
		const loadGoogleScript = () => {
			if (window.google?.maps) {
				if (!mapInitializedRef.current) initMap()
				return
			}

			const existingScript = document.querySelector(
				`script[src^="https://maps.googleapis.com/maps/api/js"]`,
			)
			if (existingScript) {
				existingScript.addEventListener('load', initMap)
				return
			}

			const script = document.createElement('script')
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=drawing`
			script.async = true
			script.defer = true
			script.onload = () => {
				if (window.google?.maps) initMap()
			}
			document.head.appendChild(script)
		}

		if (typeof window !== 'undefined') {
			loadGoogleScript()
		}
	}, [initMap])

	function backButton() {
		setView('list')
	}

	async function saveDrawing() {
		setIsSaving(true)
		const container = mapContainer.current
		if (!container) {
			setIsSaving(false)
			return
		}

		const drawingManager = drawingManagerRef.current
		if (!drawingManager) {
			console.error('DrawingManager is not initialized.')
			setIsSaving(false)
			return
		}

		drawingManager.setOptions({ drawingControl: false })

		await new Promise<void>((resolve) => {
			requestAnimationFrame(() => {
				setTimeout(resolve, 100)
			})
		})

		try {
			const html2canvasFn = (await import('html2canvas-pro')).default
			const canvas = await html2canvasFn(container, {
				useCORS: true,
				allowTaint: false,
			})

			await new Promise<void>((resolve, reject) => {
				canvas.toBlob(async (blob) => {
					if (!blob) {
						console.error('Blob creation failed.')
						toast.error('Blob creation failed!', { duration: 1500 })
						reject(new Error('Blob creation failed.'))
						return
					}
					mutate(
						{ file: blob, addressId },
						{
							onSuccess: () => {
								toast.success('Image uploaded successfully!', {
									duration: 1500,
								})
								resolve()
							},
							onError: (uploadError) => {
								console.error('Upload failed:', uploadError)
								toast.error('Image upload failed!', {
									duration: 1500,
								})
								reject(uploadError)
							},
							onSettled: () => {
								setIsSaving(false)
							},
						},
					)
				}, 'image/png')
			})
		} catch (err) {
			console.error('Operation failed:', err)
			toast.error('Operation failed!', { duration: 1500 })
			setIsSaving(false)
		} finally {
			drawingManager.setOptions({ drawingControl: true })
		}
		backButton()
	}

	const handleLocationSelect = (result: google.maps.GeocoderResult) => {
		const loc = result.geometry.location
		if (mapInstanceRef.current && loc) {
			mapInstanceRef.current.setCenter(loc)
			setMapCenter({ lat: loc.lat(), lng: loc.lng() })
			setShowGeocodeSelector(false)
		}
	}

	return {
		mapElementRef,
		showGeocodeSelector,
		geocodeOptions,
		handleLocationSelect,
		saveDrawing,
		backButton,
		isLoading: isPending || isSaving,
	}
}
