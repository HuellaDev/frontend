import { useMemo, useState, type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchMyLostReports, fetchMySightingReports } from "../../lib/reportsApi";
import { MyReportCard } from "@/components/my-reports";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Filter = "all" | "lost" | "sighting";

export const MyReports = (): ReactElement => {
  const [filter, setFilter] = useState<Filter>("all");

  const lostQuery = useQuery({
    queryKey: ["my-lost-reports"],
    queryFn: fetchMyLostReports,
  });

  const sightingQuery = useQuery({
    queryKey: ["my-sighting-reports"],
    queryFn: fetchMySightingReports,
  });

  const items = useMemo(() => {
    const lost = (lostQuery.data ?? []).map((report) => ({ kind: "lost" as const, report }));
    const sighting = (sightingQuery.data ?? []).map((report) => ({
      kind: "sighting" as const,
      report,
    }));

    const combined = [...lost, ...sighting].sort(
      (a, b) => new Date(b.report.created_at).getTime() - new Date(a.report.created_at).getTime()
    );

    if (filter === "all") return combined;
    return combined.filter((item) => item.kind === filter);
  }, [lostQuery.data, sightingQuery.data, filter]);

  const isLoading = lostQuery.isLoading || sightingQuery.isLoading;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Reports</h1>
        <Link to="/reports/new" className={cn(buttonVariants({ size: "sm" }))}>
          New Report
        </Link>
      </div>

      <div className="flex gap-1 rounded-full border border-border p-1 text-sm">
        {(["all", "lost", "sighting"] as Filter[]).map((f) => (
          <Button
            key={f}
            type="button"
            variant={filter === f ? "default" : "ghost"}
            size="sm"
            className="flex-1 rounded-full capitalize"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading your reports...</p>}

      {!isLoading && items.length === 0 && (
        <p className="text-sm text-muted-foreground">You haven't created any reports yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <MyReportCard key={item.report.id} kind={item.kind} report={item.report} />
        ))}
      </div>
    </div>
  );
};