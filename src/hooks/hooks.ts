import { FetchGeocodeResult, GeocodeResult, Location } from '@/types/types';
import { useState, useEffect } from 'react';
import { fetchGeocode } from '@/lib/geocode';
import { useRouter, useSearchParams } from 'next/navigation';

export const useDebouncedMutation = <TData>(
  mutate: (data: TData) => void,
  delay: number = 500
) => {
  const [value, setValue] = useState<TData | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value) mutate(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, mutate, delay]);

  return setValue as (data: TData) => void;
};

export function useDebouncedSearchSync(searchTerm: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchTerm, router, searchParams]);
}

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useGetLocation(): { userLocation: Location | null } {
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        } catch (error) {
          console.error('Geolocation error:', error);
        }
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };
    getUserLocation();
  }, []);

  return { userLocation };
}

export function useGetLonAndLatFromAddresses(addresses: string[]): { loading: boolean; geocodeResults: GeocodeResult[] } {
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeocodes = async () => {
      try {
        const results = await Promise.all(addresses.map(fetchGeocode));
        const validResults = results
          .filter(
            (result): result is FetchGeocodeResult & { coordinates: Location } =>
              !!result.coordinates && result.error === false
          )
          .map(
            (result): GeocodeResult => ({
              coordinates: result.coordinates,
              error: typeof result.error === 'string' ? result.error : undefined,
              zoom: result.zoom,
            })
          );
        setGeocodeResults(validResults);
        setLoading(false);
      } catch (error) {
        console.error('Geocode error:', error);
        setLoading(false);
      }
    };
    fetchGeocodes();
  }, [addresses]);

  return { loading, geocodeResults };
}


export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    setMatches(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}


export function useSearchFormLogic(isCuttingDayComponent: boolean) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [cuttingWeek, setCuttingWeek] = useState(
    searchParams.get('week') ? Number(searchParams.get('week')) : ''
  );
  const [cuttingDay, setCuttingDay] = useState(searchParams.get('day') || '');
  const [serviceDate, setServiceDate] = useState(
    searchParams.get('date') || new Date().toISOString().slice(0, 10)
  );
  const [searchTermIsServiced, setSearchTermIsServiced] = useState(searchParams.get('is_serviced') || '');

  useEffect(() => {
    if (isCuttingDayComponent && !searchParams.get('date')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('date', serviceDate);
      if (!params.get('page')) params.set('page', '1');
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [isCuttingDayComponent, searchParams, router, serviceDate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
      else params.delete('search');
      if (!params.get('page')) params.set('page', '1');
      if (isCuttingDayComponent && serviceDate) params.set('date', serviceDate);
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timeout);
  }, [debouncedSearchTerm, router, searchParams, isCuttingDayComponent, serviceDate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (name === 'search') {
      setSearchTerm(value);
      setDebouncedSearchTerm(value);
    } else {
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      switch (name) {
        case 'week':
          setCuttingWeek(value);
          break;
        case 'day':
          setCuttingDay(value);
          break;
        case 'date':
          setServiceDate(value);
          break;
        case 'is_serviced':
          setSearchTermIsServiced(value);
          break;
        default:
          break;
      }
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return {
    searchTerm,
    cuttingWeek,
    cuttingDay,
    serviceDate,
    searchTermIsServiced,
    handleChange,
  };
}