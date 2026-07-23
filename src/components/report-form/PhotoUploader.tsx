import {
  useEffect,
  type ChangeEvent,
  type Dispatch,
  type ReactElement,
  type SetStateAction,
} from "react";

import { Camera, X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PhotoUploaderProps {
  photo: File | null;
  setPhoto: Dispatch<SetStateAction<File | null>>;

  photoPreview: string | null;
  setPhotoPreview: Dispatch<SetStateAction<string | null>>;
}

export const PhotoUploader = ({
  photo,
  setPhoto,
  photoPreview,
  setPhotoPreview,
}: PhotoUploaderProps): ReactElement => {
  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }

    const url = URL.createObjectURL(photo);

    setPhotoPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photo, setPhotoPreview]);

  const handlePhotoChange = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    setPhoto(e.target.files?.[0] ?? null);
  };

  return (
    <div className="space-y-2">
      <Label>
        Photo (recommended)
      </Label>

      {photoPreview ? (
        <div className="relative w-fit">
          <img
            src={photoPreview}
            alt="Selected pet"
            className="h-40 w-40 rounded-xl border object-cover"
          />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -right-3 -top-3 h-8 w-8 rounded-full"
            onClick={() => setPhoto(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          className="
            flex cursor-pointer flex-col
            items-center justify-center
            gap-2 rounded-xl
            border border-dashed
            border-border
            py-8
            text-sm
            text-muted-foreground
            transition
            hover:bg-muted
          "
        >
          <Camera className="h-8 w-8" />

          <span>
            Click to upload a photo
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};