import { useEffect, useState } from "react";
import type { GeoLocation } from "./useGeolocation";

type LocationSource = "gps" | "ip" | null;

interface UseInitialLocationResult {
  location: GeoLocation | null;
  source: LocationSource;
}

export const useInitialLocation = (): UseInitialLocationResult => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [source, setSource] = useState<LocationSource>(null);

  useEffect(() => {
    let cancelled = false;

    const fromIp = async (): Promise<void> => {
      try {
        const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
        const data = await res.json();

        if (!cancelled && data.latitude && data.longitude) {
          setLocation({ latitude: Number(data.latitude), longitude: Number(data.longitude) });
          setSource("ip");
        }
      } catch {
        // No location available; caller keeps its own fallback.
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;
          setLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
          setSource("gps");
        },
        () => {
          fromIp();
        },
        { timeout: 8000 }
      );
    } else {
      fromIp();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return { location, source };
};