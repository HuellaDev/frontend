import type { ReactElement } from "react";

import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { LocationPicker } from "@/components/map/LocationPicker";

import type { GeoLocation } from "../../hooks/useGeolocation";
interface LocationSectionProps {
  mapCenter: GeoLocation;
  pinLocation: GeoLocation | null;
  setPinLocation: (location: GeoLocation) => void;
  gpsLocation: GeoLocation | null;
  isLocating: boolean;
  locationError: string | null;
  locate: () => void;
}

export const LocationSection = ({
  mapCenter,
  pinLocation,
  setPinLocation,
  gpsLocation,
  isLocating,
  locationError,
  locate,
}: LocationSectionProps): ReactElement => {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Location *
      </Label>

      <Button
        type="button"
        variant="outline"
        onClick={locate}
        disabled={isLocating}
        className="w-full"
      >
        {isLocating
          ? "Locating..."
          : gpsLocation
            ? "Location found ✓"
            : "Use my location"}
      </Button>

      {locationError && (
        <p className="text-sm text-red-600">
          {locationError}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Click on the map or drag the pin to adjust the exact spot.
      </p>

      <LocationPicker
        center={mapCenter}
        value={pinLocation}
        onChange={setPinLocation}
      />
    </div>
  );
};