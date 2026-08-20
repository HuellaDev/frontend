import { useEffect, useRef, useState, type ReactElement } from "react";

import MapGL, { type MapRef } from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

import { useGeolocation } from "../../hooks/useGeolocation";
import { useInitialLocation } from "../../hooks/useInitialLocation";
import { useMapMarkers } from "../../hooks/useMapMarkers";
import { useMapNearbyReports } from "../../hooks/useMapNearbyReports";
import { useDateFilter } from "../../hooks/useDateFilter";

import {
  MapControls,
  UserMarker,
  MapMarker,
  MapPopup,
} from "@/components/map-page";

import { SearchRadiusLayer } from "@/components/map-page/SearchRadiusLayer";
import { DateNavigator } from "@/components/map-page/DateNavigator";
import { DEFAULT_CENTER, MAP_STYLES } from "@/lib/mapStyles";

import type { MapStyleKey } from "@/components/map-page";
import type { MarkerGroup } from "../../types/report";

export const MapPage = (): ReactElement => {
  const mapRef = useRef<MapRef | null>(null);

  const [selectedGroup, setSelectedGroup] =
    useState<MarkerGroup | null>(null);

  const [is3D, setIs3D] = useState(false);

  const [styleKey, setStyleKey] =
    useState<MapStyleKey>("liberty");

  const dateFilter = useDateFilter();

  const {
    location: userLocation,
    isLocating,
    error: locationError,
    locate,
  } = useGeolocation();

  const {
    location: initialLocation,
    source: initialSource,
  } = useInitialLocation();

  const {
    markerGroups,
    markers,
    isLoading,
  } = useMapMarkers(
    dateFilter.asOfDate
      ? new Date(dateFilter.asOfDate).toISOString()
      : undefined,
  );

  const {
    handleMove,
    showMarkers,
    nearbyMarkers,
    nearbyMarkerGroups,
  } = useMapNearbyReports({
    markers,
    markerGroups,
    defaultCenter: DEFAULT_CENTER,
  });

  useEffect(() => {
    if (!initialLocation) return;

    mapRef.current?.flyTo({
      center: [
        initialLocation.longitude,
        initialLocation.latitude,
      ],
      zoom: initialSource === "gps" ? 13 : 10,
      duration: 0,
    });
  }, [initialLocation, initialSource]);

  useEffect(() => {
    if (!userLocation) return;

    mapRef.current?.flyTo({
      center: [
        userLocation.longitude,
        userLocation.latitude,
      ],
      zoom: 14,
      duration: 1500,
    });
  }, [userLocation]);

  return (
    <div className="-my-8 flex h-[calc(100vh-73px)] w-full flex-col overflow-hidden">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            Map
          </h1>

          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading reports..."
              : showMarkers
                ? `${nearbyMarkers.length} active reports nearby`
                : "Zoom in to see reports"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DateNavigator
            value={dateFilter.inputValue}
            maxDate={dateFilter.maxDate}
            isLive={dateFilter.isLive}
            onPrev={dateFilter.goToPreviousDay}
            onNext={dateFilter.goToNextDay}
            onChange={dateFilter.handleDateInputChange}
            onReset={dateFilter.resetToLive}
          />

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
      </div>

      {locationError && (
        <p className="mb-3 text-sm text-red-600">
          {locationError}
        </p>
      )}

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-border">
        <MapGL
          ref={mapRef}
          initialViewState={{
            longitude: DEFAULT_CENTER.longitude,
            latitude: DEFAULT_CENTER.latitude,
            zoom: 12,
          }}
          onMove={handleMove}
          pitch={is3D ? 60 : 0}
          bearing={is3D ? -20 : 0}
          mapStyle={MAP_STYLES[styleKey].url}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {showMarkers && (
            <SearchRadiusLayer markers={nearbyMarkers} />
          )}

          {userLocation && (
            <UserMarker location={userLocation} />
          )}

          {showMarkers &&
            nearbyMarkerGroups.map((group) => (
              <MapMarker
                key={group.key}
                group={group}
                onSelect={setSelectedGroup}
              />
            ))}

          {selectedGroup && (
            <MapPopup
              group={selectedGroup}
              onClose={() =>
                setSelectedGroup(null)
              }
            />
          )}
        </MapGL>
      </div>
    </div>
  );
};