import type { ReactElement } from "react";
import { Bell, BellRing } from "lucide-react";
import { usePushNotifications } from "../../hooks/usePushNotifications";

export const NotificationsSection = (): ReactElement => {
  const { isSupported, isSubscribed, isLoading, error, subscribe } = usePushNotifications();

  if (!isSupported) {
    return (
      <p className="px-3 py-3 text-sm text-muted-foreground">
        Push notifications are not supported in this browser.
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={subscribe}
        disabled={isSubscribed || isLoading}
        className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted/50 disabled:opacity-70"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {isSubscribed ? <BellRing className="size-[18px]" /> : <Bell className="size-[18px]" />}
        </span>
        <span className="flex-1">
          <span className="block font-medium">Push notifications</span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {isSubscribed
              ? "Enabled on this device."
              : isLoading
                ? "Requesting permission..."
                : "Get notified about your reports on this device."}
          </span>
        </span>
      </button>

      {error && <p className="px-3 pb-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};