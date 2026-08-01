import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

interface SettingsBlockProps {
  id: string;
  title: string;
  isFlashed: boolean;
  children: ReactElement;
}

export const SettingsBlock = ({ id, title, isFlashed, children }: SettingsBlockProps): ReactElement => (
  <section
    id={id}
    className={cn(
      "scroll-mt-8 rounded-lg border-b border-border px-3 py-8 transition-colors first:pt-3 last:border-b-0",
      isFlashed && "animate-[settings-flash_0.6s_ease-in-out_2]"
    )}
  >
    <h2 className="mb-6 text-xl font-medium tracking-tight">{title}</h2>
    {children}
  </section>
);