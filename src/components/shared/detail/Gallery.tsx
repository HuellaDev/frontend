import { useRef, useState, type ChangeEvent, type ReactElement } from "react";
import { Icon } from "@iconify/react";
import type { Photo } from "@/types/report";

interface GalleryProps {
  photos: Photo[];
  alt?: string;
  emptyIcon?: string;
  emptyLabel?: string;
  editable?: boolean;
  onAddPhotos?: (files: File[]) => void;
  onDeletePhoto?: (photoId: string) => void;
  isUploading?: boolean;
}

export const Gallery = ({
  photos,
  alt = "",
  emptyIcon = "mdi:image-off",
  emptyLabel,
  editable = false,
  onAddPhotos,
  onDeletePhoto,
  isUploading = false,
}: GalleryProps): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAddPhotos?.(files);
    e.target.value = "";
  };

  const handleDeleteActive = (): void => {
    const current = photos[activeIndex];
    if (!current) return;
    onDeletePhoto?.(current.id);
    setActiveIndex((i) => Math.max(0, i - 1));
  };

  if (photos.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted">
        <Icon icon={emptyIcon} className="h-16 w-16 text-muted-foreground" />
        {emptyLabel && <p className="text-sm text-muted-foreground">{emptyLabel}</p>}

        {editable && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mt-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Add photos"}
          </button>
        )}

        {editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <img
          src={photos[activeIndex].url}
          alt={alt}
          className="aspect-video w-full rounded-xl border border-border object-cover"
        />

        <div className="absolute right-3 top-3 flex gap-2">
          {editable && (
            <button
              type="button"
              onClick={handleDeleteActive}
              className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-red-600/80"
              title="Delete this photo"
            >
              <Icon icon="mdi:trash-can-outline" className="h-5 w-5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70"
          >
            <Icon icon="mdi:magnify-plus" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
              index === activeIndex ? "border-primary" : "border-transparent"
            }`}
          >
            <img src={photo.url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}

        {editable && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            <Icon
              icon={isUploading ? "mdi:loading" : "mdi:plus"}
              className={isUploading ? "h-5 w-5 animate-spin" : "h-5 w-5"}
            />
          </button>
        )}

        {editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={photos[activeIndex].url}
            alt={alt}
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  );
};