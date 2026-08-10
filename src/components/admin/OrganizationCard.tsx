import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";

import type { Organization } from "@/types/organization";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrganizationCardProps {
  organization: Organization;
  showActions: boolean;
  isMutating: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export const OrganizationCard = ({
  organization,
  showActions,
  isMutating,
  onApprove,
  onReject,
}: OrganizationCardProps): ReactElement => {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/help-centers/${organization.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate(`/help-centers/${organization.id}`);
        }
      }}
      className="flex cursor-pointer flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold">{organization.name}</p>
          <Badge variant="secondary">{organization.type}</Badge>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {organization.description ?? "No description"}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {organization.address ?? "No address"} · {organization.phone ?? "No phone"}
        </p>

        {organization.Profile && (
          <p className="mt-1 text-xs text-muted-foreground">
            Requested by {organization.Profile.full_name}
          </p>
        )}
      </div>

      {showActions && (
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isMutating}
            onClick={(e) => {
              e.stopPropagation();
              onReject();
            }}
          >
            <X className="size-4" />
            Reject
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isMutating}
            onClick={(e) => {
              e.stopPropagation();
              onApprove();
            }}
          >
            <Check className="size-4" />
            Approve
          </Button>
        </div>
      )}
    </div>
  );
};