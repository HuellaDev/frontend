import type { ReactElement } from "react";
import { Icon } from "@iconify/react";
import type { LostReport, SightingReport } from "@/types/report";
import { InfoField, StatusBadge, ContactRow, AttributionRow } from "@/components/shared/detail";

interface ReportInfoProps {
  kind: "lost" | "sighting";
  report: LostReport | SightingReport;
}

export const ReportInfo = ({ kind, report }: ReportInfoProps): ReactElement => {
  const isLost = kind === "lost";
  const lostReport = isLost ? (report as LostReport) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <StatusBadge color={isLost ? "red" : "blue"}>{isLost ? "Lost" : "Sighted"}</StatusBadge>
        <StatusBadge color="muted">
          <span className="capitalize">{report.status}</span>
        </StatusBadge>
      </div>

      <h1 className="text-2xl font-semibold">
        {lostReport?.pet_name || report.AnimalProfile.species}
      </h1>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoField label="Species" value={report.AnimalProfile.species} />
        <InfoField label="Breed" value={report.AnimalProfile.breed} />
        <InfoField label="Color" value={report.AnimalProfile.main_color} />
        <InfoField label="Condition" value={report.AnimalProfile.condition} />
      </div>

      {report.AnimalProfile.description && (
        <p className="text-sm text-muted-foreground">{report.AnimalProfile.description}</p>
      )}

      {isLost && lostReport && (
        <div className="space-y-2 rounded-xl border border-border p-4 text-sm">
          {lostReport.contact_phone && (
            <ContactRow icon={<Icon icon="mdi:phone" className="h-4 w-4" />} value={lostReport.contact_phone} />
          )}
          {lostReport.reward_amount && Number(lostReport.reward_amount) > 0 && (
            <ContactRow
              icon={<Icon icon="mdi:cash" className="h-4 w-4" />}
              value={`$${lostReport.reward_amount} reward`}
            />
          )}
        </div>
      )}

      <AttributionRow label="Reported by" name={report.user.full_name} photoUrl={report.user.profile_photo} />
    </div>
  );
};