import { useEffect, useState, type FormEvent, type ReactElement } from "react";
import supabase from "../../lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountSectionProps {
  onNotice: (notice: { type: "success" | "error"; message: string } | null) => void;
}

export const AccountSection = ({ onNotice }: AccountSectionProps): ReactElement => {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      const { data } = await supabase.auth.getUser();
      const currentEmail = data.user?.email ?? "";
      setEmail(currentEmail);
      setNewEmail(currentEmail);
    };
    void loadUser();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    onNotice(null);
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setSaving(false);

    if (error) {
      onNotice({ type: "error", message: error.message });
      return;
    }

    setEmail(newEmail.trim());
    onNotice({ type: "success", message: "We sent you an email to confirm your new address." });
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">{email || "Loading account..."}</p>

      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
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
        <Button type="submit" disabled={saving || newEmail.trim() === email}>
          {saving ? "Saving..." : "Update email"}
        </Button>
      </form>
    </div>
  );
};