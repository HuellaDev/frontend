import type { ReactElement } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface PendingRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const PendingRow = ({ icon: Icon, title, description }: PendingRowProps): ReactElement => (
  <div className="flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Icon className="size-[18px]" />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-medium">{title}</span>
      <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>
    </span>
    <span className="text-xs text-muted-foreground">Coming soon</span>
    <ChevronRight className="size-4 text-muted-foreground" />
  </div>
);