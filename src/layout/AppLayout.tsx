import { useState, type ReactElement } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CircleUserRound,
  LogOut,
  Menu,
  Moon,
  Settings as SettingsIcon,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
    enabled: Boolean(session),
    retry: false,
  });

  const handleLogout = async (): Promise<void> => {
    setIsMobileMenuOpen(false);
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleMobileNavigate = (path: string): void => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const profile = profileQuery.data;
  const isAdmin = profile?.role === "admin";
  const linkStyle = "text-muted-foreground transition-colors hover:text-foreground";
  const mobileLinkStyle =
    "flex items-center gap-2 rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <nav className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:gap-6 sm:py-4">
          <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2 font-semibold">
            <img src="/huella-icon.svg" alt="Huella" className="h-8 w-8 shrink-0" />
            <h2 className="truncate text-lg font-bold sm:text-xl">Huella</h2>
          </Link>

          <div className="ml-auto hidden items-center gap-6 text-sm md:flex">
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

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 md:ml-0">
            {session && <NotificationBell />}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Open account menu"
                  className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
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

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-72 max-w-[calc(100vw-2rem)] rounded-2xl p-2 shadow-xl"
                >
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
                      className={`relative flex h-8 w-16 shrink-0 items-center rounded-full p-1 transition-colors duration-300 ${
                        isDark ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <Sun
                        className={`absolute left-2 size-3.5 transition-opacity duration-200 ${
                          isDark ? "opacity-50" : "opacity-100"
                        }`}
                      />
                      <Moon
                        className={`absolute right-2 size-3.5 transition-opacity duration-200 ${
                          isDark ? "opacity-100" : "opacity-50"
                        }`}
                      />
                      <span
                        className={`relative z-10 size-6 rounded-full bg-background shadow-sm transition-transform duration-300 ease-out ${
                          isDark ? "translate-x-8" : "translate-x-0"
                        }`}
                      />
                    </span>
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => navigate("/admin")}
                      className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <ShieldCheck className="size-[18px]" />
                      </span>
                      <span className="font-medium">Admin</span>
                    </button>
                  )}

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
            ) : null}

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex size-9 shrink-0 items-center justify-center rounded-full outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col gap-1 bg-background p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <button type="button" onClick={() => handleMobileNavigate("/")} className={mobileLinkStyle}>
              Map
            </button>

            {session ? (
              <>
                <button
                  type="button"
                  onClick={() => handleMobileNavigate("/reports/mine")}
                  className={mobileLinkStyle}
                >
                  My Reports
                </button>

                <button
                  type="button"
                  onClick={() => handleMobileNavigate("/reports/new")}
                  className={mobileLinkStyle}
                >
                  New Report
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate("/admin")}
                    className={mobileLinkStyle}
                  >
                    Admin
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleMobileNavigate("/settings")}
                  className={mobileLinkStyle}
                >
                  Settings
                </button>

                <div className="my-2 h-px bg-border" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-left text-base font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleMobileNavigate("/login")}
                  className={mobileLinkStyle}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => handleMobileNavigate("/register")}
                  className={mobileLinkStyle}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <main
        className={
          isSettingsPage
            ? "flex w-full flex-1"
            : "mx-auto flex w-full max-w-5xl flex-1 px-4 py-6 sm:py-8"
        }
      >
        <Outlet />
      </main>
    </div>
  );
};