import type { ReactElement } from "react";
import { Popup } from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";

import type { Organization } from "../../types/organization";


interface OrganizationPopupProps {
  organization: Organization;
  onClose: () => void;
}


export const OrganizationPopup = ({
  organization,
  onClose,
}: OrganizationPopupProps): ReactElement => {

  const navigate = useNavigate();

  if (!organization.location) {
    return <></>;
  }


  const [longitude, latitude] =
    organization.location.coordinates;


  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      closeOnClick={false}
      onClose={onClose}
      anchor="bottom"
    >

      <div className="space-y-3 p-2">

        <h3 className="font-semibold text-base">
          {organization.name}
        </h3>


        <p className="text-sm text-muted-foreground">
          {organization.type}
        </p>


        {organization.verified && (
          <p className="text-xs text-green-600">
            ✓ Verified Help Center
          </p>
        )}


        {organization.address && (
          <p className="text-xs">
            📍 {organization.address}
          </p>
        )}


        <button
          className="w-full rounded-md bg-primary px-3 py-2 text-sm text-white"
          onClick={() =>
            navigate(`/help-centers/${organization.id}`)
          }
        >
          View details
        </button>

      </div>

    </Popup>
  );
};