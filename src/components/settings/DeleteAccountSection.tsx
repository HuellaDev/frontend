import { useState, type FormEvent, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, TriangleAlert } from "lucide-react";

import supabase from "../../lib/supabaseClient";
import { deleteMyAccount } from "../../lib/profileApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteAccountSectionProps {
  onNotice: (notice: { type: "success" | "error"; message: string } | null) => void;
}

export const DeleteAccountSection = ({ onNotice }: DeleteAccountSectionProps): ReactElement => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const resetState = (): void => {
    setPassword("");
    setError(null);
    setDeleting(false);
  };

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!deleting) {
      setOpen(nextOpen);
      if (!nextOpen) resetState();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    const email = userData.user?.email;

    if (!email) {
      setError("We couldn't verify your account. Try signing in again.");
      return;
    }

    setDeleting(true);

    // 1. Re-authenticate with the current password before allowing deletion.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setDeleting(false);
      setError("Incorrect password. Please try again.");
      return;
    }

    // 2. Ask the backend to delete the profile + auth user.
    try {
      await deleteMyAccount();
    } catch (deleteError) {
      setDeleting(false);
      setError("We couldn't delete your account. Please try again later.");
      return;
    }

    // 3. Clean up the local session and redirect.
    await supabase.auth.signOut();
    setOpen(false);
    onNotice({ type: "success", message: "Your account has been deleted." });
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-destructive">Delete account</p>
          <p className="text-sm text-muted-foreground">
            This will permanently delete your account and all of your data. This action cannot be undone.
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            <Button type="button" variant="destructive">
              Delete account
            </Button>
          }
        />

        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Delete your account</DialogTitle>
              <DialogDescription>
                Enter your password to confirm. Your account and all associated data will be permanently deleted.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="delete-account-password">Password</Label>
              <Input
                id="delete-account-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={deleting || !password}>
                {deleting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete my account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};