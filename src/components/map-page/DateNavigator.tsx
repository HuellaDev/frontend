import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateNavigatorProps {
  value: string;
  maxDate: string;
  isLive: boolean;
  onPrev: () => void;
  onNext: () => void;
  onChange: (value: string) => void;
  onReset: () => void;
}

export const DateNavigator = ({
  value,
  maxDate,
  isLive,
  onPrev,
  onNext,
  onChange,
  onReset,
}: DateNavigatorProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-muted"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <input
          type="date"
          value={value}
          max={maxDate}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 rounded-full border border-border px-3 text-xs"
        />

        <button
          type="button"
          onClick={onNext}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-muted"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {!isLive && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-muted-foreground underline"
        >
          Live
        </button>
      )}
    </div>
  );
};