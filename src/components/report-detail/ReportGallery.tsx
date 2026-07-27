import { useState, type ReactElement } from "react";
import { Icon } from "@iconify/react";
import type { Photo } from "../../types/report";

interface ReportGalleryProps {
  photos: Photo[];
}

export const ReportGallery = ({ photos }: ReportGalleryProps): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-border bg-muted">
        <Icon icon="mdi:paw" className="h-16 w-16 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <img
          src={photos[activeIndex].url}
          alt="Report"
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
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${index === activeIndex ? "border-primary" : "border-transparent"
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
            alt="Report"
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  );
};