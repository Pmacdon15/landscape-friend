'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import useGeocode from "../../../hooks/hooks";

interface MapComponentProps {
    address: string;
}

export default function MapComponent({ address }: MapComponentProps) {
    const { coordinates, zoom, error } = useGeocode(address);
    if (error) {
        return <div>Error: {error}</div>;
    }

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}&q=${coordinates.lat},${coordinates.lng}&zoom=${zoom}`;
   
    return (
        <div className="flex flex-col md:flex-row w-full ">
            <iframe
                title="Map View"
                src={mapUrl}
                className="md:w-1/2 w-full h-[200px]"
            />
            
        </div>
    );
}