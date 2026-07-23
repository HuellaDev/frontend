import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import MapGL, { Marker, Popup, type MapRef } from "react-map-gl/maplibre";
import { X, Locate, Box } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import { fetchLostReports, fetchSightingReports } from "../../lib/reportsApi";
import { useGeolocation } from "../../hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import type { MapMarker } from "../../types/report";

const MERIDA_CENTER = { longitude: -89.6237, latitude: 20.9674 };

type MapStyleKey = "liberty" | "dark" | "fiord";

const MAP_STYLES: Record<MapStyleKey, { label: string; url: string }> = {
  liberty: { label: "Light", url: "https://tiles.openfreemap.org/styles/liberty" },
  dark: { label: "Dark", url: "https://tiles.openfreemap.org/styles/dark" },
  fiord: { label: "Fiord", url: "https://tiles.openfreemap.org/styles/fiord" },
};

interface MarkerGroup {
  key: string;
  longitude: number;
  latitude: number;
  markers: MapMarker[];
}

const groupNearbyMarkers = (markers: MapMarker[]): MarkerGroup[] => {
  const groups = new Map<string, MarkerGroup>();

  for (const marker of markers) {
    const key = `${marker.latitude.toFixed(4)},${marker.longitude.toFixed(4)}`;
    const existing = groups.get(key);

    if (existing) {
      existing.markers.push(marker);
    } else {
      groups.set(key, {
        key,
        longitude: marker.longitude,
        latitude: marker.latitude,
        markers: [marker],
      });
    }
  }

  return Array.from(groups.values());
};

export const MapPage = (): ReactElement => {
  const mapRef = useRef<MapRef>(null);

  const [selectedGroup, setSelectedGroup] = useState<MarkerGroup | null>(null);
  const [is3D, setIs3D] = useState<boolean>(false);
  const [styleKey, setStyleKey] = useState<MapStyleKey>("liberty");

  const { location: userLocation, isLocating, error: locationError, locate } = useGeolocation();

  const lostReportsQuery = useQuery({
    queryKey: ["lost-reports", "active"],
    queryFn: fetchLostReports,
  });

  const sightingReportsQuery = useQuery({
    queryKey: ["sighting-reports", "active"],
    queryFn: fetchSightingReports,
  });

  const markers = useMemo<MapMarker[]>(() => {
    const lostMarkers: MapMarker[] = (lostReportsQuery.data ?? [])
      .filter((report) => report.last_seen_location)
      .map((report) => ({
        id: report.id,
        kind: "lost",
        longitude: report.last_seen_location!.coordinates[0],
        latitude: report.last_seen_location!.coordinates[1],
        report,
      }));

    const sightingMarkers: MapMarker[] = (sightingReportsQuery.data ?? [])
      .filter((report) => report.location)
      .map((report) => ({
        id: report.id,
        kind: "sighting",
        longitude: report.location!.coordinates[0],
        latitude: report.location!.coordinates[1],
        report,
      }));

    return [...lostMarkers, ...sightingMarkers];
  }, [lostReportsQuery.data, sightingReportsQuery.data]);

  const markerGroups = useMemo(() => groupNearbyMarkers(markers), [markers]);

  const isLoading = lostReportsQuery.isLoading || sightingReportsQuery.isLoading;

  useEffect(() => {
    if (userLocation) {
      mapRef.current?.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 14,
        duration: 1500,
      });
    }
  }, [userLocation]);

  return (
    <div className="flex h-[calc(100vh-73px)] w-full flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Map</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading reports..." : `${markers.length} active reports nearby`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1 rounded-full border border-border p-1">
            {(Object.keys(MAP_STYLES) as MapStyleKey[]).map((key) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={styleKey === key ? "default" : "ghost"}
                className="h-7 rounded-full px-3 text-xs"
                onClick={() => setStyleKey(key)}
              >
                {MAP_STYLES[key].label}
              </Button>
            ))}
          </div>

          <Button
            type="button"
            size="sm"
            variant={is3D ? "default" : "outline"}
            className="h-7 gap-1.5 rounded-full px-3 text-xs"
            onClick={() => setIs3D((prev) => !prev)}
          >
            <Box className="h-3.5 w-3.5" />
            3D
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 gap-1.5 rounded-full px-3 text-xs"
            onClick={locate}
            disabled={isLocating}
          >
            <Locate className="h-3.5 w-3.5" />
            {isLocating ? "Locating..." : "Locate me"}
          </Button>

          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            Lost
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            Sighted
          </span>
        </div>
      </div>

      {locationError && <p className="mb-3 text-sm text-red-600">{locationError}</p>}

      <div className="relative flex-1 overflow-hidden rounded-2xl border border-border">
        <MapGL
          ref={mapRef}
          initialViewState={{
            longitude: MERIDA_CENTER.longitude,
            latitude: MERIDA_CENTER.latitude,
            zoom: 12,
          }}
          pitch={is3D ? 60 : 0}
          bearing={is3D ? -20 : 0}
          mapStyle={MAP_STYLES[styleKey].url}
          style={{ width: "100%", height: "100%" }}
        >
          {userLocation && (
            <Marker longitude={userLocation.longitude} latitude={userLocation.latitude}>
              <div className="relative flex h-4 w-4 items-center justify-center">
                <span className="absolute h-4 w-4 animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              </div>
            </Marker>
          )}

          {markerGroups.map((group) => {
            const hasLost = group.markers.some((m) => m.kind === "lost");
            const color = hasLost ? "bg-red-500" : "bg-blue-500";

            return (
              <Marker
                key={group.key}
                longitude={group.longitude}
                latitude={group.latitude}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedGroup(group);
                }}
              >
                <div
                  className={`relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-md ${color}`}
                >
                  {group.markers.length > 1 && (
                    <span className="text-[10px] font-bold text-white">
                      {group.markers.length}
                    </span>
                  )}
                </div>
              </Marker>
            );
          })}

          {selectedGroup && (
            <Popup
              longitude={selectedGroup.longitude}
              latitude={selectedGroup.latitude}
              onClose={() => setSelectedGroup(null)}
              closeButton={false}
              closeOnClick={false}
              anchor="bottom"
              maxWidth="280px"
            >
              <div className="relative p-1">
                <button
                  type="button"
                  onClick={() => setSelectedGroup(null)}
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1 pt-1">
                  {selectedGroup.markers.map((marker) => {
                    const photo =
                      marker.report.Photos?.find((p) => p.is_primary) ?? marker.report.Photos?.[0];
                    const isLost = marker.kind === "lost";
                    const petName = isLost
                      ? (marker.report as { pet_name: string | null }).pet_name
                      : null;

                    return (
                      <Link
                        key={marker.id}
                        to={`/reports/${marker.id}`}
                        className="flex gap-3 rounded-lg border border-gray-200 p-2 text-sm text-gray-900 hover:bg-gray-50"
                      >
                        {photo ? (
                          <img
                            src={photo.url}
                            alt={marker.report.AnimalProfile.species}
                            className="h-16 w-16 shrink-0 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xl">
                            🐾
                          </div>
                        )}

                        <div className="flex flex-col justify-center">
                          <span
                            className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-white ${
                              isLost ? "bg-red-500" : "bg-blue-500"
                            }`}
                          >
                            {isLost ? "Lost" : "Sighted"}
                          </span>
                          <p className="mt-1 font-semibold">
                            {petName || marker.report.AnimalProfile.species}
                          </p>
                          <p className="text-gray-600">
                            {marker.report.AnimalProfile.breed && `${marker.report.AnimalProfile.breed} · `}
                            {marker.report.AnimalProfile.main_color}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </Popup>
          )}
        </MapGL>
      </div>
    </div>
  );
};