import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactElement } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, CircleUserRound } from "lucide-react";

import { fetchMyProfile, updateMyProfile, uploadMyProfilePhoto } from "../../lib/profileApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileSectionProps {
  onNotice: (notice: { type: "success" | "error"; message: string } | null) => void;
}

export const ProfileSection = ({ onNotice }: ProfileSectionProps): ReactElement => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
  });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profileQuery.data) {
      setFullName(profileQuery.data.full_name);
      setPhone(profileQuery.data.phone ?? "");
    }
  }, [profileQuery.data]);

  const updateProfileMutation = useMutation({
    mutationFn: () => updateMyProfile({ full_name: fullName, phone }),
    onSuccess: () => {
      onNotice({ type: "success", message: "Profile updated." });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => {
      onNotice({ type: "error", message: "Could not update profile." });
    },
  });

  const photoMutation = useMutation({
    mutationFn: (file: File) => uploadMyProfilePhoto(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => {
      onNotice({ type: "error", message: "Could not upload photo." });
    },
  });

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) photoMutation.mutate(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onNotice(null);
    updateProfileMutation.mutate();
  };

  return (
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

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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

        <Button type="submit" disabled={updateProfileMutation.isPending} className="sm:col-span-2 sm:w-fit">
          {updateProfileMutation.isPending ? "Saving..." : "Save profile"}
        </Button>
      </form>
    </div>
  );
};