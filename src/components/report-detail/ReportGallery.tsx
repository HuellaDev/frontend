import { useState, type ReactElement } from "react";
import { Icon } from "@iconify/react";
import type { Photo } from "../../types/report";

interface ReportGalleryProps {
  photos: Photo[];
}

export const ReportGallery = ({ photos }: ReportGalleryProps): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-border bg-muted">
        <Icon icon="mdi:paw" className="h-16 w-16 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <img
        src={photos[activeIndex].url}
        alt="Report"
        className="h-64 w-full rounded-xl border border-border object-cover sm:h-80"
      />

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
    </div>
  );
};