import type { ReactElement } from "react";
import { Icon } from "@iconify/react";
import type { LostReport, SightingReport } from "../../types/report";

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
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase text-white ${
            isLost ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {isLost ? "Lost" : "Sighted"}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
          {report.status}
        </span>
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
            <div className="flex items-center gap-2">
              <Icon icon="mdi:phone" className="h-4 w-4 text-muted-foreground" />
              <span>{lostReport.contact_phone}</span>
            </div>
          )}
          {lostReport.reward_amount && Number(lostReport.reward_amount) > 0 && (
            <div className="flex items-center gap-2">
              <Icon icon="mdi:cash" className="h-4 w-4 text-muted-foreground" />
              <span>${lostReport.reward_amount} reward</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
        {report.user.profile_photo ? (
          <img src={report.user.profile_photo} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <Icon icon="mdi:account-circle" className="h-8 w-8" />
        )}
        <span>Reported by {report.user.full_name}</span>
      </div>
    </div>
  );
};

const InfoField = ({ label, value }: { label: string; value: string | null }): ReactElement | null => {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
};