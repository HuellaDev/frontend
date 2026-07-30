import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Camera,
  Check,
  ChevronRight,
  CircleUserRound,
  Database,
  Eye,
  FileText,
  Info,
  Mail,
  Moon,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
} from "lucide-react";

import supabase from "../../lib/supabaseClient";
import { fetchMyProfile, updateMyProfile, uploadMyProfilePhoto } from "../../lib/profileApi";
import { useTheme } from "../../hooks/useTheme";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Notice = { type: "success" | "error"; message: string } | null;
type SettingsGroup = "account" | "app" | "reports";

const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "0.0.0";

const navigation: Array<{
  id: SettingsGroup;
  label: string;
  icon: typeof CircleUserRound;
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
      { id: "profile-privacy", label: "Profile & privacy" },
    ],
  },
  {
    id: "app",
    label: "App settings",
    icon: SlidersHorizontal,
    items: [
      { id: "appearance", label: "Appearance" },
      { id: "notifications", label: "Notifications" },
      { id: "accessibility", label: "Accessibility" },
    ],
  },
  {
    id: "reports",
    label: "Reports & data",
    icon: Database,
    items: [
      { id: "report-preferences", label: "Report preferences" },
      { id: "data-storage", label: "Data & storage" },
      { id: "about-huella", label: "About Huella" },
    ],
  },
];

interface SettingsBlockProps {
  id: string;
  title: string;
  isFlashed: boolean;
  children: ReactElement;
}

const SettingsBlock = ({ id, title, isFlashed, children }: SettingsBlockProps): ReactElement => (
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

interface PendingRowProps {
  icon: typeof Bell;
  title: string;
  description: string;
}

const PendingRow = ({ icon: Icon, title, description }: PendingRowProps): ReactElement => (
  <div className="flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Icon className="size-[18px]" />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-medium">{title}</span>
      <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>
    </span>
    <span className="text-xs text-muted-foreground">Coming soon</span>
    <ChevronRight className="size-4 text-muted-foreground" />
  </div>
);

export const Settings = (): ReactElement => {
  const queryClient = useQueryClient();
  const { isDark, toggleTheme } = useTheme();

  const [activeGroup, setActiveGroup] = useState<SettingsGroup>("account");
  const [flashedId, setFlashedId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
  });

  useEffect(() => {
    if (profileQuery.data) {
      setFullName(profileQuery.data.full_name);
      setPhone(profileQuery.data.phone ?? "");
    }
  }, [profileQuery.data]);

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      const { data } = await supabase.auth.getUser();
      const currentEmail = data.user?.email ?? "";
      setEmail(currentEmail);
      setNewEmail(currentEmail);
    };
    void loadUser();
  }, []);

  const updateProfileMutation = useMutation({
    mutationFn: () => updateMyProfile({ full_name: fullName, phone }),
    onSuccess: () => {
      setNotice({ type: "success", message: "Profile updated." });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => {
      setNotice({ type: "error", message: "Could not update profile." });
    },
  });

  const photoMutation = useMutation({
    mutationFn: (file: File) => uploadMyProfilePhoto(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => {
      setNotice({ type: "error", message: "Could not upload photo." });
    },
  });

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) photoMutation.mutate(file);
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setNotice(null);
    updateProfileMutation.mutate();
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setNotice(null);
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setSavingEmail(false);

    if (error) {
      setNotice({ type: "error", message: error.message });
      return;
    }

    setEmail(newEmail.trim());
    setNotice({ type: "success", message: "We sent you an email to confirm your new address." });
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setNotice(null);
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);

    if (error) {
      setNotice({ type: "error", message: error.message });
      return;
    }

    setPassword("");
    setNotice({ type: "success", message: "Your password was updated successfully." });
  };

  const selectGroup = (group: SettingsGroup, sectionId?: string): void => {
    setActiveGroup(group);

    if (!sectionId) return;

    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setFlashedId(sectionId);
      window.setTimeout(() => setFlashedId(null), 1200);
    }, 0);
  };

  const content = (): ReactElement => {
    if (activeGroup === "account") {
      return (
        <>
          <SettingsBlock id="profile-info" title="Profile" isFlashed={flashedId === "profile-info"}>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                  {profileQuery.data?.profile_photo ? (
                    <img
                      src={profileQuery.data.profile_photo}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <CircleUserRound className="size-7 text-muted-foreground" />
                  )}
                </div>

                <label className="cursor-pointer text-sm font-medium text-primary hover:underline">
                  <span className="flex items-center gap-1.5">
                    <Camera className="size-4" />
                    {photoMutation.isPending ? "Uploading..." : "Change photo"}
                  </span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>

              <form onSubmit={handleProfileSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
                </div>

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="sm:col-span-2 sm:w-fit"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save profile"}
                </Button>
              </form>
            </div>
          </SettingsBlock>

          <SettingsBlock
            id="account-information"
            title="Account information"
            isFlashed={flashedId === "account-information"}
          >
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">{email || "Loading account..."}</p>

              <form
                onSubmit={handleEmailSubmit}
                className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={savingEmail || newEmail.trim() === email}>
                  {savingEmail ? "Saving..." : "Update email"}
                </Button>
              </form>
            </div>
          </SettingsBlock>

          <SettingsBlock
            id="password-security"
            title="Password & security"
            isFlashed={flashedId === "password-security"}
          >
            <form
              onSubmit={handlePasswordSubmit}
              className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
            >
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground">Use at least 6 characters.</p>
              </div>
              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? "Saving..." : "Update password"}
              </Button>
            </form>
          </SettingsBlock>

          <SettingsBlock
            id="profile-privacy"
            title="Profile & privacy"
            isFlashed={flashedId === "profile-privacy"}
          >
            <div className="space-y-1">
              <PendingRow
                icon={Eye}
                title="Profile visibility"
                description="Control who can see your profile details."
              />
              <PendingRow
                icon={ShieldCheck}
                title="Contact privacy"
                description="Choose how contact details appear on reports."
              />
            </div>
          </SettingsBlock>
        </>
      );
    }

    if (activeGroup === "app") {
      return (
        <>
          <SettingsBlock id="appearance" title="Appearance" isFlashed={flashedId === "appearance"}>
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
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  Use a darker color scheme.
                </span>
              </span>
              <span
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  isDark ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-background shadow-sm transition-transform duration-300 ${
                    isDark ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </span>
            </button>
          </SettingsBlock>

          <SettingsBlock
            id="notifications"
            title="Notifications"
            isFlashed={flashedId === "notifications"}
          >
            <div className="space-y-1">
              <PendingRow
                icon={Bell}
                title="Report updates"
                description="Updates about reports you created or follow."
              />
              <PendingRow
                icon={Mail}
                title="Email notifications"
                description="Choose which updates you receive by email."
              />
            </div>
          </SettingsBlock>

          <SettingsBlock
            id="accessibility"
            title="Accessibility"
            isFlashed={flashedId === "accessibility"}
          >
            <div className="space-y-1">
              <PendingRow
                icon={Palette}
                title="Display preferences"
                description="Adjust contrast and visual comfort settings."
              />
              <PendingRow
                icon={Info}
                title="Help & feedback"
                description="Get help or share feedback about Huella."
              />
            </div>
          </SettingsBlock>
        </>
      );
    }

    return (
      <>
        <SettingsBlock
          id="report-preferences"
          title="Report preferences"
          isFlashed={flashedId === "report-preferences"}
        >
          <div className="space-y-1">
            <PendingRow
              icon={FileText}
              title="Report defaults"
              description="Set defaults for the reports you create."
            />
            <PendingRow
              icon={Bell}
              title="Followed reports"
              description="Manage updates for reports you are following."
            />
          </div>
        </SettingsBlock>

        <SettingsBlock id="data-storage" title="Data & storage" isFlashed={flashedId === "data-storage"}>
          <div className="space-y-1">
            <PendingRow
              icon={Database}
              title="Media storage"
              description="Manage local media and upload preferences."
            />
            <PendingRow
              icon={Eye}
              title="Your data"
              description="Review data linked to your Huella account."
            />
          </div>
        </SettingsBlock>

        <SettingsBlock id="about-huella" title="About Huella" isFlashed={flashedId === "about-huella"}>
          <div className="flex items-center gap-4 rounded-lg px-3 py-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Info className="size-[18px]" />
            </span>
            <span>
              <span className="block font-medium">Huella</span>
              <span className="block text-sm text-muted-foreground">Version {APP_VERSION}</span>
            </span>
          </div>
        </SettingsBlock>
      </>
    );
  };

  return (
    <div className="flex w-full flex-1">
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
            <p className="truncate text-sm font-semibold">
              {profileQuery.data?.full_name ?? "Your account"}
            </p>
            <p className="truncate text-xs text-muted-foreground">Settings</p>
          </div>
        </div>

        <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-wide text-muted-foreground">
          USER SETTINGS
        </p>

        <nav className="space-y-2">
          {navigation.map(({ id, label, icon: Icon, items }) => (
            <div key={id}>
              <button
                type="button"
                onClick={() => selectGroup(id)}
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
                      onClick={() => selectGroup(id, item.id)}
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

      <main className="min-w-0 flex-1 py-6 sm:px-8 sm:py-8 md:px-10">
        <div className="mb-5 sm:hidden">
          <label htmlFor="settings-group" className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground">
            SETTINGS
          </label>
          <select
            id="settings-group"
            value={activeGroup}
            onChange={(event) => setActiveGroup(event.target.value as SettingsGroup)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            {navigation.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {notice && (
          <Alert className="mb-5" variant={notice.type === "error" ? "destructive" : "default"}>
            {notice.type === "success" && <Check />}
            <AlertDescription>{notice.message}</AlertDescription>
          </Alert>
        )}

        {content()}
      </main>
    </div>
  );
};