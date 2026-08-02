import type { ReactElement } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";

import { fetchMyNotifications, markNotificationAsRead } from "../../lib/notificationsApi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formatRelativeTime = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d`;
};

export const NotificationBell = (): ReactElement => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ["my-notifications"],
    queryFn: fetchMyNotifications,
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
    },
  });

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Notifications"
        className="relative flex size-9 items-center justify-center rounded-full outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-80 rounded-2xl p-2 shadow-xl">
        <p className="px-2 py-1.5 text-sm font-semibold">Notifications</p>

        {notifications.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">No notifications yet.</p>
        )}

        <div className="max-h-96 space-y-1 overflow-y-auto">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => !notification.is_read && markReadMutation.mutate(notification.id)}
              className={`flex w-full flex-col gap-0.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted ${
                notification.is_read ? "" : "bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-2">
                {!notification.is_read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                <span className="text-sm font-medium">{notification.title}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(notification.created_at)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};