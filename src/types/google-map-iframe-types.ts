

export interface MapComponentProps {
    addresses: string[];
}

export interface Location {
    lat: number;
    lng: number;
}

export interface GeocodeResult {
    coordinates: Location;
    error?: string;
    zoom?: number;
}

// Match the actual return type of fetchGeocode based on error messages
export type FetchGeocodeResult =
    |
    {
        coordinates: Location;
        zoom: number;
        error: boolean;
    }
    |
    {
        error: string | boolean;
        coordinates?: never;
        zoom?: never;
    };
