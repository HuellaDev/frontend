import { useEffect, useRef, useState, type ReactElement } from "react";

import MapGL, { type MapRef } from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

import { useGeolocation } from "../../hooks/useGeolocation";
import { useInitialLocation } from "../../hooks/useInitialLocation";
import { useMapReports } from "../../hooks/useMapReports";

import {
  MapControls,
  UserMarker,
  ReportMarker,
  ReportPopup,
} from "@/components/map-page";

import type { MapStyleKey } from "@/components/map-page";
import type { MarkerGroup } from "../../types/report";

// Last-resort fallback only: used briefly before GPS/IP location resolves.
const DEFAULT_CENTER = { longitude: -89.6237, latitude: 20.9674 };

const MAP_STYLES: Record<
  MapStyleKey,
  {
    label: string;
    url: string;
  }
> = {
  liberty: {
    label: "Light",
    url: "https://tiles.openfreemap.org/styles/liberty",
  },

  dark: {
    label: "Dark",
    url: "https://tiles.openfreemap.org/styles/dark",
  },

  fiord: {
    label: "Fiord",
    url: "https://tiles.openfreemap.org/styles/fiord",
  },
};

export const MapPage = (): ReactElement => {
  const mapRef = useRef<MapRef>(null);

  const [selectedGroup, setSelectedGroup] = useState<MarkerGroup | null>(null);

  const [is3D, setIs3D] = useState(false);

  const [styleKey, setStyleKey] = useState<MapStyleKey>("liberty");

  const {
    location: userLocation,
    isLocating,
    error: locationError,
    locate,
  } = useGeolocation();

  const { location: initialLocation, source: initialSource } = useInitialLocation();

  const { markerGroups, markers, isLoading } = useMapReports();

  // Runs once, automatically, when the page first loads: centers the map
  // on the user's real location (GPS) or, if denied/unavailable, on their
  // approximate location from IP. No animation, this replaces the initial view.
  useEffect(() => {
    if (!initialLocation) return;

    mapRef.current?.flyTo({
      center: [initialLocation.longitude, initialLocation.latitude],
      zoom: initialSource === "gps" ? 13 : 10,
      duration: 0,
    });
  }, [initialLocation, initialSource]);

  // Runs when the user explicitly clicks "Locate me" (animated, precise GPS).
  useEffect(() => {
    if (!userLocation) return;

    mapRef.current?.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 14,
      duration: 1500,
    });
  }, [userLocation]);

  return (
    <div className=" -my-8 flex h-[calc(100vh-73px)] w-full flex-col  overflow-hidden">
      <div
        className="
          mb-4
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
        "
      >
        <div>
          <h1 className="text-2xl font-semibold">Map</h1>

          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading reports..." : `${markers.length} active reports nearby`}
          </p>
        </div>

        <MapControls
          styleKey={styleKey}
          setStyleKey={setStyleKey}
          mapStyles={MAP_STYLES}
          is3D={is3D}
          setIs3D={setIs3D}
          isLocating={isLocating}
          locate={locate}
        />
      </div>

      {locationError && <p className="mb-3 text-sm text-red-600">{locationError}</p>}

      <div
        className="
    relative
    min-h-0
    flex-1
    overflow-hidden
    rounded-2xl
    border
    border-border
  "
      >
        <MapGL
          ref={mapRef}
          initialViewState={{
            longitude: DEFAULT_CENTER.longitude,
            latitude: DEFAULT_CENTER.latitude,
            zoom: 12,
          }}
          pitch={is3D ? 60 : 0}
          bearing={is3D ? -20 : 0}
          mapStyle={MAP_STYLES[styleKey].url}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {userLocation && <UserMarker location={userLocation} />}

          {markerGroups.map((group) => (
            <ReportMarker key={group.key} group={group} onSelect={setSelectedGroup} />
          ))}

          {selectedGroup && (
            <ReportPopup group={selectedGroup} onClose={() => setSelectedGroup(null)} />
          )}
        </MapGL>
      </div>
    </div>
  );
};