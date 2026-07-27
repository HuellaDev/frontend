import type { ReactElement } from "react";
import { Marker } from "react-map-gl/maplibre";
import { Icon } from "@iconify/react";
import type { Organization } from "../../types/organization";

interface OrganizationMarkerProps {
  organization: Organization;
  onSelect: (organization: Organization) => void;
}

export const OrganizationMarker = ({
  organization,
  onSelect,
}: OrganizationMarkerProps): ReactElement | null => {
  if (!organization.location) return null;

  const [longitude, latitude] = organization.location.coordinates;

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      style={{ zIndex: 20 }}
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onSelect(organization);
      }}
    >
      <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-green-600 shadow-md">
        <Icon icon="mdi:hospital-box" className="h-3.5 w-3.5 text-white" />
      </div>
    </Marker>
  );
};