import { useState, type ReactElement } from "react";
import { Check } from "lucide-react";

import {
  SettingsBlock,
  SettingsSidebar,
  settingsNavigation,
  type SettingsGroup,
  ProfileSection,
  AccountSection,
  PasswordSection,
  AppearanceSection,
  // ProfilePrivacySection,
  NotificationsSection,
  AboutSection,
  // AccessibilitySection,
  // ReportPreferencesSection,
  // DataStorageSection,
  // AboutSection,
} from "@/components/settings";

import { Alert, AlertDescription } from "@/components/ui/alert";

type Notice = { type: "success" | "error"; message: string } | null;

export const Settings = (): ReactElement => {
  const [activeGroup, setActiveGroup] = useState<SettingsGroup>("account");
  const [flashedId, setFlashedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

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
            <ProfileSection onNotice={setNotice} />
          </SettingsBlock>

          <SettingsBlock
            id="account-information"
            title="Account information"
            isFlashed={flashedId === "account-information"}
          >
            <AccountSection onNotice={setNotice} />
          </SettingsBlock>

          <SettingsBlock
            id="password-security"
            title="Password & security"
            isFlashed={flashedId === "password-security"}
          >
            <PasswordSection onNotice={setNotice} />
          </SettingsBlock>

          {/* //TODO integrate ProfilePrivacySEctions in already use */}
          {/* <SettingsBlock
            id="profile-privacy"
            title="Profile & privacy"
            isFlashed={flashedId === "profile-privacy"}
          >
            <ProfilePrivacySection />
          </SettingsBlock> */}
        </>
      );
    }

    if (activeGroup === "app") {
      return (
        <>
          <SettingsBlock id="appearance" title="Appearance" isFlashed={flashedId === "appearance"}>
            <AppearanceSection />
          </SettingsBlock>

          <SettingsBlock id="notifications" title="Notifications" isFlashed={flashedId === "notifications"}>
            <NotificationsSection />
          </SettingsBlock>

          <SettingsBlock id="about-huella" title="About Huella" isFlashed={flashedId === "about-huella"}>
            <AboutSection />
          </SettingsBlock>

          {/* <SettingsBlock id="accessibility" title="Accessibility" isFlashed={flashedId === "accessibility"}>
            <AccessibilitySection />
          </SettingsBlock> */}
        </>
      );
    }

    return (
      <>



      </>
    );
  };

  return (
    <div className="flex w-full flex-1">
      <SettingsSidebar activeGroup={activeGroup} onSelectGroup={selectGroup} />

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
            {settingsNavigation.map((item) => (
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