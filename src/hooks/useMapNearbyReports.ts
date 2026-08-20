import { useMemo, useState } from "react";

import type { ViewStateChangeEvent } from "react-map-gl/maplibre";

import { getDistanceKm } from "../lib/geo";

import type { MapMarker, MarkerGroup } from "../types/report";

const MIN_ZOOM_FOR_MARKERS = 8;

const ZOOM_THRESHOLD_FOR_SMALL_RADIUS = 12;

const NEARBY_RADIUS_FAR_KM = 10;

const NEARBY_RADIUS_NEAR_KM = 5;

interface Coordinates {
  longitude: number;
  latitude: number;
}

interface UseMapNearbyReportsParams {
  markers: MapMarker[];
  markerGroups: MarkerGroup[];
  defaultCenter: Coordinates;
  initialZoom?: number;
}

export const useMapNearbyReports = ({
  markers,
  markerGroups,
  defaultCenter,
  initialZoom = 12,
}: UseMapNearbyReportsParams) => {
  const [zoom, setZoom] = useState(initialZoom);

  const [mapCenter, setMapCenter] =
    useState<Coordinates>(defaultCenter);

  const handleMove = (e: ViewStateChangeEvent) => {
    setZoom(e.viewState.zoom);

    setMapCenter({
      longitude: e.viewState.longitude,
      latitude: e.viewState.latitude,
    });
  };

  const nearbyRadiusKm =
    zoom >= ZOOM_THRESHOLD_FOR_SMALL_RADIUS
      ? NEARBY_RADIUS_NEAR_KM
      : NEARBY_RADIUS_FAR_KM;

  const showMarkers = zoom >= MIN_ZOOM_FOR_MARKERS;

  const nearbyMarkers = useMemo(() => {
    return markers.filter(
      (marker) =>
        getDistanceKm(
          mapCenter.latitude,
          mapCenter.longitude,
          marker.latitude,
          marker.longitude,
        ) <= nearbyRadiusKm,
    );
  }, [markers, mapCenter, nearbyRadiusKm]);

  const nearbyMarkerGroups = useMemo(() => {
    return markerGroups.filter(
      (group) =>
        getDistanceKm(
          mapCenter.latitude,
          mapCenter.longitude,
          group.latitude,
          group.longitude,
        ) <= nearbyRadiusKm,
    );
  }, [markerGroups, mapCenter, nearbyRadiusKm]);

  return {
    zoom,
    mapCenter,
    handleMove,
    showMarkers,
    nearbyMarkers,
    nearbyMarkerGroups,
  };
};