import type { ReactElement } from "react";
import { Marker } from "react-map-gl/maplibre";
import type { MapMarker } from "../../types/report";

interface MarkerGroup {
  key: string;
  longitude: number;
  latitude: number;
  markers: MapMarker[];
}

interface ReportMarkerProps {
  group: MarkerGroup;
  onSelect: (group: MarkerGroup) => void;
}

export const ReportMarker = ({
  group,
  onSelect,
}: ReportMarkerProps): ReactElement => {
  const hasLost = group.markers.some(
    (marker) => marker.kind === "lost",
  );

  const color = hasLost
    ? "bg-red-500"
    : "bg-blue-500";


  return (
    <Marker
      longitude={group.longitude}
      latitude={group.latitude}
      onClick={(event) => {
        event.originalEvent.stopPropagation();
        onSelect(group);
      }}
    >
      <div className={` flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-md ${color}`}>

        {group.markers.length > 1 && (

          <span className=" text-[10px] font-bold text-white">
              
            {group.markers.length}

          </span>
        )}
        
      </div>
    </Marker>
  );
};