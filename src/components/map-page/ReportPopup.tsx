import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Popup } from "react-map-gl/maplibre";
import { Icon } from "@iconify/react";

import type { MarkerGroup } from "../../types/report";


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
      maxWidth="320px"
    >

      <div className="relative rounded-xl p-1">


        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-2
            top-2
            z-10
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-md
            ring-1
            ring-gray-200
            transition
            hover:bg-red-50
            hover:text-red-500
            active:scale-95
          "
        >
          <X className="h-4 w-4" />
        </button>



        <div
          className="
            flex
            max-h-80
            flex-col
            gap-2
            overflow-y-auto
            pr-1
            pt-1
          "
        >

          {group.items.map((item) => {


            if (item.type === "organization") {

              const organization = item.organization;


              return (
                <div
                  key={organization.id}
                  className="
        flex
        gap-3
        rounded-xl
        border
        border-green-200
        border-l-4
        border-l-green-600
        p-2
        text-sm
      "
                >

                  {organization.Photos?.[0] ? (

                    <img
                      src={organization.Photos[0].url}
                      alt={organization.name}
                      className="
            h-16
            w-16
            shrink-0
            rounded-lg
            object-cover
          "
                    />

                  ) : (

                    <div
                      className="
            flex
            h-16
            w-16
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-green-100
          "
                    >
                      <Icon
                        icon="mdi:hospital-box"
                        className="h-8 w-8 text-green-600"
                      />
                    </div>

                  )}



                  <div className="flex flex-col justify-center">

                    <span
                      className="
            w-fit
            rounded-full
            bg-green-600
            px-2
            py-0.5
            text-[10px]
            font-semibold
            uppercase
            text-white
          "
                    >
                      Help Center
                    </span>


                    <p className="mt-1 font-semibold">
                      {organization.name}
                    </p>


                    <p className="text-gray-600">
                      {organization.type}
                    </p>

                  </div>


                </div>
              );
            }



            const marker = item.marker;


            const photo =
              marker.report.Photos?.find(
                (photo) => photo.is_primary,
              ) ??
              marker.report.Photos?.[0];



            const isLost = marker.kind === "lost";


            const petName =
              isLost
                ? (marker.report as {
                  pet_name: string | null;
                }).pet_name
                : null;



            return (
              <Link
                key={marker.id}
                to={`/reports/${marker.id}`}
                className={`
                  flex
                  gap-3
                  rounded-xl
                  border
                  border-gray-200
                  border-l-4
                  ${isLost
                    ? "border-l-red-500"
                    : "border-l-blue-500"
                  }
                  p-2
                  text-sm
                  transition
                  hover:bg-gray-50
                `}
              >

                {photo ? (

                  <img
                    src={photo.url}
                    alt={marker.report.AnimalProfile.species}
                    className="
                      h-16
                      w-16
                      shrink-0
                      rounded-lg
                      object-cover
                    "
                  />

                ) : (

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-lg
                      bg-gray-100
                    "
                  >
                    <Icon
                      icon="mdi:paw"
                      className="h-8 w-8 text-gray-400"
                    />
                  </div>

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
                    {petName || marker.report.AnimalProfile.species}
                  </p>



                  <p className="text-gray-600">
                    {marker.report.AnimalProfile.breed &&
                      `${marker.report.AnimalProfile.breed} · `}
                    {marker.report.AnimalProfile.main_color}
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