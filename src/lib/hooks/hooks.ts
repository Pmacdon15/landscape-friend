import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Location } from '@/types/google-map-iframe-types'
// import { fetchGeocode } from '../actions/geo-codes-action'

export const useDebouncedMutation = <TData>(
	mutate: (data: TData) => void,
	delay: number = 500,
) => {
	const [value, setValue] = useState<TData | null>(null)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (value) mutate(value)
		}, delay)

		return () => clearTimeout(timeoutId)
	}, [value, mutate, delay])

	return setValue as (data: TData) => void
}

export function useDebouncedSearchSync(searchTerm: string) {
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString())
		if (searchTerm) {
			params.set('search', searchTerm)
		} else {
			params.delete('search')
		}
		router.replace(`?${params.toString()}`, { scroll: false })
	}, [searchTerm, router, searchParams])
}

export function useDebouncedValue<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}

export function useGetLocation(): { userLocation: Location | '' } {
	const [userLocation, setUserLocation] = useState<Location | ''>('')
	const hasFetched = useRef(false)

	useEffect(() => {
		if (userLocation || hasFetched.current) {
			return
		}

		const getUserLocation = async () => {
			if (navigator.geolocation) {
				hasFetched.current = true
				try {
					const position = await new Promise<GeolocationPosition>(
						(resolve, reject) => {
							navigator.geolocation.getCurrentPosition(
								resolve,
								reject,
							)
						},
					)
					setUserLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					})
				} catch (error) {
					console.error('Geolocation error:', error)
				}
			} else {
				console.error('Geolocation is not supported by this browser.')
			}
		}
		getUserLocation()
	}, [userLocation])

	return { userLocation }
}

// export function useGetLonAndLatFromAddresses(addresses: string[]): {
// 	loading: boolean
// 	geocodeResults: GeocodeResult[]
// } {
// 	const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([])
// 	const [loading, setLoading] = useState(true)

// 	useEffect(() => {
// 		const fetchGeocodes = async () => {
// 			setLoading(true)
// 			try {
// 				const results = await Promise.all(
// 					addresses.map(async (address) => ({
// 						address,
// 						result: await fetchGeocode(address),
// 					})),
// 				)
// 				console.log(results)
// 				const validResults = results
// 					.filter(
// 						(
// 							item,
// 						): item is {
// 							address: string
// 							result: FetchGeocodeResult & {
// 								coordinates: Location
// 							}
// 						} =>
// 							!!item.result.coordinates &&
// 							item.result.error === false,
// 					)
// 					.map(
// 						(item): GeocodeResult => ({
// 							address: item.address,
// 							coordinates: item.result.coordinates,
// 							error:
// 								typeof item.result.error === 'string'
// 									? item.result.error
// 									: undefined,
// 							zoom: item.result.zoom,
// 						}),
// 					)
// 				setGeocodeResults(validResults)
// 				setLoading(false)
// 			} catch (error) {
// 				console.error('Geocode error:', error)
// 				setLoading(false)
// 			}
// 		}
// 		fetchGeocodes()
// 	}, [addresses])

// 	return { loading, geocodeResults }
// }

// export function useMediaQuery(query: string) {
// 	const [matches, setMatches] = useState(false)

// 	useEffect(() => {
// 		const mediaQuery = window.matchMedia(query)
// 		const handleChange = () => setMatches(mediaQuery.matches)
// 		mediaQuery.addEventListener('change', handleChange)
// 		setMatches(mediaQuery.matches)

// 		return () => {
// 			mediaQuery.removeEventListener('change', handleChange)
// 		}
// 	}, [query])

// 	return matches
// }

// export function useBillingStatusSearch() {
// 	const router = useRouter()
// 	const searchParams = useSearchParams()
// 	const currentStatus = searchParams.get('status') || 'all'

// 	const setBillingStatus = (status: string) => {
// 		const params = new URLSearchParams(searchParams.toString())
// 		if (status && status !== 'all') {
// 			params.set('status', status)
// 		} else {
// 			params.delete('status')
// 		}
// 		params.set('page', '1')
// 		router.replace(`?${params.toString()}`, { scroll: false })
// 	}

// 	return { currentStatus, setBillingStatus }
// }

// export function useSearchParam(paramName: string, defaultValue: string = '') {
// 	const router = useRouter()
// 	const searchParams = useSearchParams()
// 	const currentValue = searchParams.get(paramName) || defaultValue

// 	const setParam = (value: string) => {
// 		const params = new URLSearchParams(searchParams.toString())
// 		if (value && value !== defaultValue) {
// 			params.set(paramName, value)
// 		} else {
// 			params.delete(paramName)
// 		}
// 		params.set('page', '1')
// 		router.replace(`?${params.toString()}`, { scroll: false })
// 	}

// 	return { currentValue, setParam }
// }

// export function useCuttingPeriodSearch(paramName: 'week' | 'day') {
// 	const { currentValue: currentPeriod, setParam: setCuttingPeriod } =
// 		useSearchParam(paramName, '')
// 	return { currentPeriod, setCuttingPeriod }
// }

// export function useServiceDateSearch() {
// 	const today = new Date().toISOString().slice(0, 10)
// 	const { currentValue: rawValue, setParam: setServiceDate } = useSearchParam(
// 		'date',
// 		'',
// 	)
// 	const currentServiceDate = rawValue || today
// 	return { currentServiceDate, setServiceDate }
// }

// export function useServiceStatusSearch() {
// 	const { currentValue: currentServiceStatus, setParam: setServiceStatus } =
// 		useSearchParam('serviced', '')
// 	return { currentServiceStatus, setServiceStatus }
// }

// export function useSearchInput(delay: number = 600) {
// 	const router = useRouter()
// 	const searchParams = useSearchParams()
// 	const urlSearchTerm = searchParams.get('search') || ''

// 	const [searchTerm, setSearchTerm] = useState(urlSearchTerm)

// 	useEffect(() => {
// 		setSearchTerm(urlSearchTerm)
// 	}, [urlSearchTerm])

// 	useEffect(() => {
// 		const handler = setTimeout(() => {
// 			if (searchTerm !== urlSearchTerm) {
// 				const params = new URLSearchParams(searchParams.toString())
// 				if (searchTerm) {
// 					params.set('search', searchTerm)
// 				} else {
// 					params.delete('search')
// 				}
// 				router.replace(`?${params.toString()}`, { scroll: false })
// 			}
// 		}, delay)

// 		return () => {
// 			clearTimeout(handler)
// 		}
// 	}, [searchTerm, urlSearchTerm, delay, router, searchParams])

// 	return { searchTerm, setSearchTerm }
// }

// export function useCreateQuoteForm({
// 	isSuccess,
// 	reset,
// 	fields,
// 	append,
// }: {
// 	isSuccess: boolean
// 	reset: () => void
// 	fields: MaterialField[]
// 	append: (material: {
// 		materialType: string
// 		materialCostPerUnit: number
// 		materialUnits: number
// 	}) => void
// }) {
// 	useEffect(() => {
// 		if (isSuccess) {
// 			reset()
// 		}
// 	}, [isSuccess, reset])

// 	useEffect(() => {
// 		if (fields.length === 0) {
// 			append({
// 				materialType: '',
// 				materialCostPerUnit: 0,
// 				materialUnits: 0,
// 			})
// 		}
// 	}, [fields.length, append])
// }

// export function useResetFormOnSuccess<T extends object>(
// 	isSuccess: boolean,
// 	submittedData: React.MutableRefObject<T | null>,
// 	reset: UseFormReset<T>,
// ) {
// 	useEffect(() => {
// 		if (isSuccess && submittedData.current) {
// 			reset(submittedData.current)
// 		}
// 	}, [isSuccess, reset, submittedData])
// }

// export const useFetchGeocode = (address: string) => {
// 	return useQuery({
// 		queryKey: ['geocodes', address],
// 		queryFn: () => fetchGeocode(address),
// 	})
// }
