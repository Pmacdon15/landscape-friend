"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import GoogleMapReact from "google-map-react";
import useGeocode from "../../../hooks/hooks";
import { useState } from "react";

interface MapComponentProps {
    address: string;
}

const AnyReactComponent = () => (
    <div className="text-red-600 font-bold text-lg">
        <FontAwesomeIcon icon={faLocationDot} />
    </div>
);

export default function MapComponent({ address }: MapComponentProps) {
    const { coordinates, zoom, error } = useGeocode(address);
    const [showPoint, setShowPoint] = useState(false)
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="w-full h-[200px]">
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY! }}
                defaultCenter={coordinates}
                defaultZoom={zoom}
                center={coordinates}
                onGoogleApiLoaded={() => setShowPoint(!showPoint)}
            >
                {showPoint && <AnyReactComponent />}
            </GoogleMapReact>
        </div>
    );
}