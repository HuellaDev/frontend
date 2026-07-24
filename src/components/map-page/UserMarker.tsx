import type { ReactElement } from "react";

import { Marker } from "react-map-gl/maplibre";

import type { GeoLocation } from "../../hooks/useGeolocation";


interface UserMarkerProps {
  location: GeoLocation;
}


export const UserMarker = ({
  location,
}: UserMarkerProps): ReactElement => {
  return (
    <Marker
      longitude={location.longitude}
      latitude={location.latitude}
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        <span
          className=" absolute h-5 w-5 animate-ping rounded-full bg-green-500 opacity-75"/>

        <span
          className=" relative h-3 w-3 rounded-full border-2 border-white bg-green-500"/>
      </div>
    </Marker>
  );
};