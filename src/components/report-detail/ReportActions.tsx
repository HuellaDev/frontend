import type { ReactElement } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReportStatus } from "../../lib/reportsApi";
import { Button } from "@/components/ui/button";

interface ReportActionsProps {
  kind: "lost" | "sighting";
  reportId: string;
  status: string;
}

export const ReportActions = ({ kind, reportId, status }: ReportActionsProps): ReactElement | null => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStatus: string) => updateReportStatus(kind, reportId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
      queryClient.invalidateQueries({ queryKey: ["lost-reports"] });
      queryClient.invalidateQueries({ queryKey: ["sighting-reports"] });
    },
  });

  if (status !== "active") return null;

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate("resolved")}
    >
      {mutation.isPending ? "Updating..." : "Mark as resolved"}
    </Button>
  );
};