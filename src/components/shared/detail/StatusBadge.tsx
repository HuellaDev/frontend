import type { ReactElement, ReactNode } from "react";

interface StatusBadgeProps {
  children: ReactNode;
  color?: "red" | "blue" | "green" | "muted" | "outline";
  icon?: ReactNode;
}

const colorClasses: Record<NonNullable<StatusBadgeProps["color"]>, string> = {
  red: "bg-red-500 text-white",
  blue: "bg-blue-500 text-white",
  green: "bg-green-500 text-white",
  muted: "bg-muted text-foreground",
  outline: "border border-border text-foreground",
};

export const StatusBadge = ({ children, color = "muted", icon }: StatusBadgeProps): ReactElement => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase ${colorClasses[color]}`}
  >
    {icon}
    {children}
  </span>
);