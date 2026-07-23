import { useState, useCallback } from "react";

export interface GeoLocation {
  longitude: number;
  latitude: number;
}

interface UseGeolocationResult {
  location: GeoLocation | null;
  isLocating: boolean;
  error: string | null;
  locate: () => void;
}

export const useGeolocation = (): UseGeolocationResult => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback((): void => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
        setIsLocating(false);
      },
      (geoError) => {
        setIsLocating(false);

        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError("Location permission denied.");
        } else {
          setError("Could not get your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { location, isLocating, error, locate };
};