import type { ReactElement } from "react";
import { MapPin, Phone, BadgeCheck, CircleAlert } from "lucide-react";
import type { Organization } from "@/types/organization";
import { StatusBadge, ContactRow, AttributionRow } from "@/components/shared/detail";

interface HelpCenterInfoProps {
  organization: Organization;
}

export const HelpCenterInfo = ({ organization }: HelpCenterInfoProps): ReactElement => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <StatusBadge
        color={organization.verified ? "green" : "muted"}
        icon={organization.verified ? <BadgeCheck size={16} /> : <CircleAlert size={16} />}
      >
        {organization.verified ? "Verified" : "Pending Verification"}
      </StatusBadge>
      <StatusBadge color="outline">
        <span className="capitalize">{organization.type}</span>
      </StatusBadge>
    </div>

    <h1 className="text-2xl font-semibold">{organization.name}</h1>

    {organization.description && (
      <p className="text-sm text-muted-foreground">{organization.description}</p>
    )}

    <div className="space-y-3 text-sm">
      {organization.address && (
        <ContactRow icon={<MapPin className="h-5 w-5" />} label="Address" value={organization.address} />
      )}
      {organization.phone && (
        <ContactRow icon={<Phone className="h-5 w-5" />} label="Phone" value={organization.phone} />
      )}
    </div>

    {organization.Profile && (
      <AttributionRow label="Managed by" name={organization.Profile.full_name} photoUrl={organization.Profile.profile_photo} />
    )}
  </div>
);