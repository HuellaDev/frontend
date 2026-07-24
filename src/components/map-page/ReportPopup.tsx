import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Popup } from "react-map-gl/maplibre";
import type { MapMarker } from "../../types/report";
import { Icon } from "@iconify/react";

interface MarkerGroup {
  key: string;
  longitude: number;
  latitude: number;
  markers: MapMarker[];
}

interface ReportPopupProps {
  group: MarkerGroup;
  onClose: () => void;
}

export const ReportPopup = ({
  group,
  onClose,
}: ReportPopupProps): ReactElement => {
  return (
    <Popup
      longitude={group.longitude}
      latitude={group.latitude}
      onClose={onClose}
      closeButton={false}
      closeOnClick={false}
      anchor="bottom"
      maxWidth="280px"
    >
      <div className="relative p-1">

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            -right-1
            -top-1
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-white
            text-gray-500
            shadow-sm
            ring-1
            ring-gray-200
            transition
            hover:bg-gray-100
            hover:text-gray-900
          "
        >

          <X className="h-3.5 w-3.5" />

        </button>


        <div
          className=" flex max-h-80 flex-col gap-2 overflow-y-auto pr-1 pt-1">

          {group.markers.map((marker) => {

            const photo =
              marker.report.Photos?.find(
                (item) => item.is_primary,
              ) ??
              marker.report.Photos?.[0];


            const isLost = marker.kind === "lost";


            const petName = isLost ? (marker.report as { pet_name: string | null; }).pet_name : null;


            return (
              <Link
                key={marker.id}
                to={`/reports/${marker.id}`}
                className=" flex gap-3 rounded-lg border
                border-gray-200 p-2 text-sm
                text-gray-900 transition
                hover:bg-gray-50">

                {photo ? (
                  <img
                    src={photo.url}
                    alt={
                      marker.report.AnimalProfile.species
                    }
                    className=" h-16 w-16 shrink-0 rounded-md object-cover"/>
                ) : (
                  <Icon
                    icon="mdi:paw"
                    className="h-8 w-8 text-gray-400"
                  />
                )}


                <div className="flex flex-col justify-center">

                  <span
                    className={`
                      w-fit
                      rounded-full
                      px-2
                      py-0.5
                      text-[10px]
                      font-semibold
                      uppercase
                      text-white
                      ${isLost
                        ? "bg-red-500"
                        : "bg-blue-500"
                      }
                    `}
                  >
                    {isLost ? "Lost" : "Sighted"}
                  </span>


                  <p className="mt-1 font-semibold">
                    {
                      petName || marker.report.AnimalProfile.species
                    }
                  </p>


                  <p className="text-gray-600">
                    {marker.report.AnimalProfile.breed && `${marker.report.AnimalProfile.breed} · `}

                    {
                      marker.report.AnimalProfile.main_color
                    }
                  </p>

                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </Popup>
  );
};