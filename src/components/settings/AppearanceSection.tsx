import type { ReactElement } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export const AppearanceSection = (): ReactElement => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {isDark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
      </span>
      <span className="flex-1">
        <span className="block font-medium">Dark mode</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">Use a darker color scheme.</span>
      </span>
      <span className={`relative h-7 w-12 rounded-full transition-colors ${isDark ? "bg-primary" : "bg-muted"}`}>
        <span
          className={`absolute top-1 size-5 rounded-full bg-background shadow-sm transition-transform duration-300 ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
};