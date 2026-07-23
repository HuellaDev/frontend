import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";

export type ReportKind = "lost" | "sighting";

interface ReportTypeSelectorProps {
  kind: ReportKind;
  onChange: (value: ReportKind) => void;
}

export const ReportTypeSelector = ({
  kind,
  onChange,
}: ReportTypeSelectorProps): ReactElement => {
  return (
    <div className="flex gap-1 rounded-xl border bg-muted p-1">
      <Button
        type="button"
        variant={kind === "lost" ? "default" : "ghost"}
        className="flex-1"
        onClick={() => onChange("lost")}
      >
        Lost Pet
      </Button>

      <Button
        type="button"
        variant={kind === "sighting" ? "default" : "ghost"}
        className="flex-1"
        onClick={() => onChange("sighting")}
      >
        Sighting
      </Button>
    </div>
  );
};