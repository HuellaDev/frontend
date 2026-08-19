import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type ReactElement,
  type SetStateAction,
} from "react";

import { Camera, X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface MultiPhotoUploaderProps {
  photos: File[];
  setPhotos: Dispatch<SetStateAction<File[]>>;
  required?: boolean;
  maxPhotos?: number;
}

export const MultiPhotoUploader = ({
  photos,
  setPhotos,
  required = false,
  maxPhotos = 8,
}: MultiPhotoUploaderProps): ReactElement => {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  const handlePhotosChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setPhotos((prev) => [...prev, ...files].slice(0, maxPhotos));
    e.target.value = "";
  };

  const removeAt = (index: number): void => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label>
        Photos {required ? "*" : "(recommended)"}
      </Label>

      <div className="flex flex-wrap gap-3">
        {previews.map((preview, index) => (
          <div key={preview} className="relative h-28 w-28">
            <img
              src={preview}
              alt={`Photo ${index + 1}`}
              className="h-full w-full rounded-xl border object-cover"
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
              onClick={() => removeAt(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <label
            className="
              flex h-28 w-28 cursor-pointer flex-col
              items-center justify-center gap-1
              rounded-xl border border-dashed border-border
              text-xs text-muted-foreground
              transition hover:bg-muted
            "
          >
            <Camera className="h-6 w-6" />
            <span>Add photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotosChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};