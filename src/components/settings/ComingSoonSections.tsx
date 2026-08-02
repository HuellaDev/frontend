import type { ReactElement } from "react";
import { Bell, Database, Eye, FileText, Info, Palette, ShieldCheck } from "lucide-react";
import { PendingRow } from "./PendingRow";

const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "0.0.0";

export const ProfilePrivacySection = (): ReactElement => (
  <div className="space-y-1">
    <PendingRow icon={Eye} title="Profile visibility" description="Control who can see your profile details." />
    <PendingRow icon={ShieldCheck} title="Contact privacy" description="Choose how contact details appear on reports." />
  </div>
);

export const AccessibilitySection = (): ReactElement => (
  <div className="space-y-1">
    <PendingRow icon={Palette} title="Display preferences" description="Adjust contrast and visual comfort settings." />
    <PendingRow icon={Info} title="Help & feedback" description="Get help or share feedback about Huella." />
  </div>
);

export const ReportPreferencesSection = (): ReactElement => (
  <div className="space-y-1">
    <PendingRow icon={FileText} title="Report defaults" description="Set defaults for the reports you create." />
    <PendingRow icon={Bell} title="Followed reports" description="Manage updates for reports you are following." />
  </div>
);

export const DataStorageSection = (): ReactElement => (
  <div className="space-y-1">
    <PendingRow icon={Database} title="Media storage" description="Manage local media and upload preferences." />
    <PendingRow icon={Eye} title="Your data" description="Review data linked to your Huella account." />
  </div>
);

export const AboutSection = (): ReactElement => (
  <div className="flex items-center gap-4 rounded-lg px-3 py-3">
    <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Info className="size-[18px]" />
    </span>
    <span>
      <span className="block font-medium">Huella</span>
      <span className="block text-sm text-muted-foreground">Version {APP_VERSION}</span>
    </span>
  </div>
);