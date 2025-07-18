"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import GoogleMapReact from "google-map-react";

interface MarkerProps {
  lat: number;
  lng: number;
}

const AnyReactComponent = ({ lat, lng }: MarkerProps) => (
  <div className="text-red-600 font-bold text-lg">
    <FontAwesomeIcon icon={faLocationDot} />
  </div>
);

export default function MapComponent() {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <div className="w-full h-[200px]">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={defaultProps.center.lat}
          lng={defaultProps.center.lng}
        />
      </GoogleMapReact>
    </div>
  );
}