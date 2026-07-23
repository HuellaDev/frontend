import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Map, { Marker, Popup, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { fetchLostReports, fetchSightingReports } from "../../lib/reportsApi";
import { useGeolocation } from "../../hooks/useGeolocation";
import type { MapMarker } from "../../types/report";

const MERIDA_CENTER = { longitude: -89.6237, latitude: 20.9674 };

type MapStyleKey = "liberty" | "dark" | "fiord";

const MAP_STYLES: Record<MapStyleKey, { label: string; url: string }> = {
  liberty: { label: "Light", url: "https://tiles.openfreemap.org/styles/liberty" },
  dark: { label: "Dark", url: "https://tiles.openfreemap.org/styles/dark" },
  fiord: { label: "Fiord", url: "https://tiles.openfreemap.org/styles/fiord" },
};

export const MapPage = (): ReactElement => {
  const mapRef = useRef<MapRef>(null);

  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
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

  const isLoading = lostReportsQuery.isLoading || sightingReportsQuery.isLoading;

  const handleLocateMe = (): void => {
    locate();
  };

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

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 rounded-full border border-border p-1">
            {(Object.keys(MAP_STYLES) as MapStyleKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setStyleKey(key)}
                className={`rounded-full px-3 py-1 font-medium transition ${
                  styleKey === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {MAP_STYLES[key].label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIs3D((prev) => !prev)}
            className={`rounded-full border px-3 py-1 font-medium transition ${
              is3D
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            3D
          </button>

          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
            {isLocating ? "Locating..." : "Locate me"}
          </button>

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            Lost
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            Sighted
          </span>
        </div>
      </div>

      {locationError && (
        <p className="mb-3 text-sm text-red-600">{locationError}</p>
      )}

      <div className="relative flex-1 overflow-hidden rounded-2xl border border-border">
        <Map
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

          {markers.map((marker) => (
            <Marker
              key={`${marker.kind}-${marker.id}`}
              longitude={marker.longitude}
              latitude={marker.latitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedMarker(marker);
              }}
            >
              <div
                className={`h-4 w-4 cursor-pointer rounded-full border-2 border-white shadow-md ${
                  marker.kind === "lost" ? "bg-red-500" : "bg-blue-500"
                }`}
              />
            </Marker>
          ))}

          {selectedMarker && (
            <Popup
              longitude={selectedMarker.longitude}
              latitude={selectedMarker.latitude}
              onClose={() => setSelectedMarker(null)}
              closeOnClick={false}
              anchor="bottom"
            >
              <div className="min-w-[180px] p-1 text-sm text-gray-900">
                <p className="font-semibold">
                  {selectedMarker.kind === "lost" ? "Lost" : "Sighted"}:{" "}
                  {selectedMarker.report.AnimalProfile.species}
                </p>
                {selectedMarker.report.AnimalProfile.main_color && (
                  <p className="text-gray-600">
                    Color: {selectedMarker.report.AnimalProfile.main_color}
                  </p>
                )}
                <Link
                  to={`/reports/${selectedMarker.id}`}
                  className="mt-2 inline-block font-medium text-blue-600 hover:underline"
                >
                  View report
                </Link>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
};