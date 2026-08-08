import type { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchReportById } from "@/lib/reportsApi";
import { useAuth } from "@/hooks/useAuth";
import { Gallery } from "@/components/shared/detail";
import { ReportInfo, ReportActions, CommentsSection } from "@/components/report-detail";

export const ReportDetail = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();

  const reportQuery = useQuery({
    queryKey: ["report", id],
    queryFn: () => fetchReportById(id!),
    enabled: Boolean(id),
  });

  if (reportQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading report...</p>;
  }

  if (reportQuery.isError || !reportQuery.data) {
    return <p className="text-sm text-red-600">Report not found.</p>;
  }

  const { kind, report } = reportQuery.data;
  const reportType = kind === "lost" ? "lost_report" : "sighting_report";
  const isOwner = session?.user.id === report.user.id;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 rounded-xl border border-border bg-background p-6 pb-10">
      <Gallery photos={report.Photos ?? []} emptyIcon="mdi:paw" />
      <ReportInfo kind={kind} report={report} />

      {isOwner && <ReportActions kind={kind} reportId={report.id} status={report.status} />}

      <CommentsSection reportType={reportType} reportId={report.id} />
    </div>
  );
};