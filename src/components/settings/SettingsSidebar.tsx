import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircleUserRound, Database, type LucideIcon, SlidersHorizontal } from "lucide-react";

import { fetchMyProfile } from "../../lib/profileApi";
import { cn } from "@/lib/utils";

export type SettingsGroup = "account" | "app" ;

export const settingsNavigation: Array<{
  id: SettingsGroup;
  label: string;
  icon: LucideIcon;
  items: Array<{ id: string; label: string }>;
}> = [
  {
    id: "account",
    label: "Account",
    icon: CircleUserRound,
    items: [
      { id: "profile-info", label: "Profile" },
      { id: "account-information", label: "Account information" },
      { id: "password-security", label: "Password & security" },
      // { id: "profile-privacy", label: "Profile & privacy" },
    ],
  },
  {
    id: "app",
    label: "App settings",
    icon: SlidersHorizontal,
    items: [
      { id: "appearance", label: "Appearance" },
      { id: "notifications", label: "Notifications" },
      { id: "about-huella", label: "About Huella" },
      // { id: "accessibility", label: "Accessibility" },
    ],
  },
  
];

interface SettingsSidebarProps {
  activeGroup: SettingsGroup;
  onSelectGroup: (group: SettingsGroup, sectionId?: string) => void;
}

export const SettingsSidebar = ({ activeGroup, onSelectGroup }: SettingsSidebarProps): ReactElement => {
  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
  });

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-muted/15 py-6 pr-4 sm:block">
      <div className="mb-6 flex items-center gap-3 px-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
          {profileQuery.data?.profile_photo ? (
            <img src={profileQuery.data.profile_photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <CircleUserRound className="size-4 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{profileQuery.data?.full_name ?? "Your account"}</p>
          <p className="truncate text-xs text-muted-foreground">Settings</p>
        </div>
      </div>

      <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-wide text-muted-foreground">
        USER SETTINGS
      </p>


      

      <nav className="space-y-2">

        {settingsNavigation.map(({ id, label, icon: Icon, items }) => (
          <div key={id}>
            <button
              type="button"
              onClick={() => onSelectGroup(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                activeGroup === id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>

            {activeGroup === id && (
              <div className="my-1 ml-6 border-l border-border pl-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectGroup(id, item.id)}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};