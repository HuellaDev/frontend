import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import type { LostReport, SightingReport } from "../../types/report";

interface MyReportCardProps {
  kind: "lost" | "sighting";
  report: LostReport | SightingReport;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  resolved: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export const MyReportCard = ({ kind, report }: MyReportCardProps): ReactElement => {
  const isLost = kind === "lost";
  const petName = isLost ? (report as LostReport).pet_name : null;
  const photo = report.Photos?.find((p) => p.is_primary) ?? report.Photos?.[0];

  return (
    <Link
      to={`/reports/${report.id}`}
      className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm hover:bg-muted"
    >
      {photo ? (
        <img src={photo.url} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon icon="mdi:paw" className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-white ${
              isLost ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            {isLost ? "Lost" : "Sighted"}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
              STATUS_STYLES[report.status] ?? "bg-muted"
            }`}
          >
            {report.status}
          </span>
        </div>

        <p className="mt-1 truncate font-medium">{petName || report.AnimalProfile.species}</p>
        <p className="truncate text-muted-foreground">
          {report.AnimalProfile.breed && `${report.AnimalProfile.breed} · `}
          {report.AnimalProfile.main_color}
        </p>
      </div>

      <Icon icon="mdi:chevron-right" className="h-5 w-5 shrink-0 text-muted-foreground" />
    </Link>
  );
};