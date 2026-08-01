import { useState, type FormEvent, type ReactElement } from "react";
import supabase from "../../lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordSectionProps {
  onNotice: (notice: { type: "success" | "error"; message: string } | null) => void;
}

export const PasswordSection = ({ onNotice }: PasswordSectionProps): ReactElement => {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    onNotice(null);
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      onNotice({ type: "error", message: error.message });
      return;
    }

    setPassword("");
    onNotice({ type: "success", message: "Your password was updated successfully." });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
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
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Update password"}
      </Button>
    </form>
  );
};