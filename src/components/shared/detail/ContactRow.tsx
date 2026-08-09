import type { ReactElement, ReactNode } from "react";

interface ContactRowProps {
  icon: ReactNode;
  label?: string;
  value: string;
}

export const ContactRow = ({ icon, label, value }: ContactRowProps): ReactElement => (
  <div className="flex items-start gap-3">
    <span className="mt-1 shrink-0 text-muted-foreground">{icon}</span>
    <div>
      {label && <p className="font-medium">{label}</p>}
      <p className={label ? "text-muted-foreground" : ""}>{value}</p>
    </div>
  </div>
);