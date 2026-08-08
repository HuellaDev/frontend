import { useState, type ReactElement } from "react";
import { Icon } from "@iconify/react";
import type { Photo } from "@/types/report";

interface GalleryProps {
  photos: Photo[];
  alt?: string;
  emptyIcon?: string;
  emptyLabel?: string;
}

export const Gallery = ({
  photos,
  alt = "",
  emptyIcon = "mdi:image-off",
  emptyLabel,
}: GalleryProps): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted">
        <Icon icon={emptyIcon} className="h-16 w-16 text-muted-foreground" />
        {emptyLabel && <p className="text-sm text-muted-foreground">{emptyLabel}</p>}
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

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70"
        >
          <Icon icon="mdi:magnify-plus" className="h-5 w-5" />
        </button>
      </div>

      {photos.length > 1 && (
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
        </div>
      )}

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