import type { ReactElement } from "react";

interface InfoFieldProps {
  label: string;
  value?: string | null;
}

export const InfoField = ({ label, value }: InfoFieldProps): ReactElement | null => {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
};