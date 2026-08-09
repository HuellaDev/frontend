import type { ReactElement } from "react";
import { Marker } from "react-map-gl/maplibre";
import type { MarkerGroup } from "../../types/report";


interface MapMarkerProps {
  group: MarkerGroup;
  onSelect: (group: MarkerGroup) => void;
}


export const MapMarker = ({
  group,
  onSelect,
}: MapMarkerProps): ReactElement => {


  const hasLost = group.items.some(
    (item) =>
      item.type === "report" &&
      item.marker.kind === "lost",
  );


  const hasOrganization = group.items.some(
    (item) =>
      item.type === "organization",
  );


  const color = hasOrganization
    ? "bg-green-600"
    : hasLost
      ? "bg-red-500"
      : "bg-blue-500";



  const count = group.items.length;



  return (
    <Marker
      longitude={group.longitude}
      latitude={group.latitude}
      onClick={(event) => {
        event.originalEvent.stopPropagation();
        onSelect(group);
      }}
    >

      <div
        className={`
          flex
          h-7
          w-7
          cursor-pointer
          items-center
          justify-center
          rounded-full
          border-2
          border-white
          shadow-md
          ${color}
        `}
      >

        {count > 1 && (
          <span className="text-[10px] font-bold text-white">
            {count}
          </span>
        )}

      </div>

    </Marker>
  );
};