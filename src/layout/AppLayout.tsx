import type { ReactElement } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CircleUserRound, LogOut, Moon, Settings as SettingsIcon, Sun } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { fetchMyProfile } from "../lib/profileApi";
import supabase from "../lib/supabaseClient";
import { NotificationBell } from "../components/layout/NotificationBell";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "0.0.0";

export const AppLayout = (): ReactElement => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSettingsPage = location.pathname === "/settings";
  const { isDark, toggleTheme } = useTheme();

  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
    enabled: Boolean(session),
  });

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const profile = profileQuery.data;
  const linkStyle = "text-muted-foreground transition-colors hover:text-foreground";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold"
          >
            <img
              src="/huella-icon.svg"
              alt="Huella"
              className="w-8 h-8"
            />
            <h2 className="text-xl font-bold">
              Huella
            </h2>
          </Link>

          <div className="ml-auto flex items-center gap-6 text-sm">
            <Link to="/" className={linkStyle}>
              Map
            </Link>

            {session ? (
              <>
                <Link to="/reports/mine" className={linkStyle}>
                  My Reports
                </Link>

                <Link to="/reports/new" className={linkStyle}>
                  New Report
                </Link>

                <NotificationBell />

                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="Open account menu"
                    className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-border outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {profile?.profile_photo ? (
                      <img
                        src={profile.profile_photo}
                        alt="Profile photo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <CircleUserRound className="size-5 text-muted-foreground" />
                    )}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" sideOffset={10} className="w-72 rounded-2xl p-2 shadow-xl">
                    <div className="flex items-center gap-3 rounded-xl px-2 py-3">
                      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border">
                        {profile?.profile_photo ? (
                          <img src={profile.profile_photo} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <CircleUserRound className="size-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {profile?.full_name ?? session.user.email?.split("@")[0]}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
                      </div>
                    </div>

                    <DropdownMenuSeparator className="my-1.5" />

                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        {isDark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="font-medium">Visual mode</span>
                        <span className="text-xs text-muted-foreground">{isDark ? "Dark" : "Light"}</span>
                      </span>
                      <span
                        className={`relative flex h-8 w-16 shrink-0 items-center rounded-full p-1 transition-colors duration-300 ${isDark ? "bg-primary" : "bg-muted"
                          }`}
                      >
                        <Sun className={`absolute left-2 size-3.5 transition-opacity duration-200 ${isDark ? "opacity-50" : "opacity-100"}`} />
                        <Moon className={`absolute right-2 size-3.5 transition-opacity duration-200 ${isDark ? "opacity-100" : "opacity-50"}`} />
                        <span
                          className={`relative z-10 size-6 rounded-full bg-background shadow-sm transition-transform duration-300 ease-out ${isDark ? "translate-x-8" : "translate-x-0"
                            }`}
                        />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/settings")}
                      className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <SettingsIcon className="size-[18px]" />
                      </span>
                      <span className="font-medium">Settings</span>
                    </button>

                    <DropdownMenuSeparator className="my-1.5" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-red-600 transition-colors hover:bg-red-50"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                        <LogOut className="size-[18px]" />
                      </span>
                      <span className="font-medium">Log out</span>
                    </button>

                    <div className="px-3 pb-1 pt-2 text-xs text-muted-foreground">
                      Huella · version {APP_VERSION}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login" className={linkStyle}>
                  Login
                </Link>

                <Link to="/register" className={linkStyle}>
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className={isSettingsPage ? "flex w-full flex-1" : "mx-auto flex w-full max-w-5xl flex-1 px-4 py-8"}>
        <Outlet />
      </main>
    </div>
  );
};