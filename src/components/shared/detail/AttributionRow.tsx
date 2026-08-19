import type { ReactElement } from "react";
import { Icon } from "@iconify/react";

interface AttributionRowProps {
  label: string;
  name: string;
  photoUrl?: string | null;
}

export const AttributionRow = ({ label, name, photoUrl }: AttributionRowProps): ReactElement => (
  <div className="flex items-center gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
    {photoUrl ? (
      <img src={photoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
    ) : (
      <Icon icon="mdi:account-circle" className="h-8 w-8" />
    )}
    <span>
      {label} {name}
    </span>
  </div>
);