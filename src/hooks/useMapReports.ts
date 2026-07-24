import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  fetchLostReports,
  fetchSightingReports,
} from "../lib/reportsApi";

import type { MapMarker } from "../types/report";


interface MarkerGroup {
  key: string;
  longitude: number;
  latitude: number;
  markers: MapMarker[];
}


const groupNearbyMarkers = (
  markers: MapMarker[],
): MarkerGroup[] => {
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


export const useMapReports = () => {

  const lostReportsQuery = useQuery({
    queryKey: ["lost-reports", "active"],
    queryFn: fetchLostReports,
  });


  const sightingReportsQuery = useQuery({
    queryKey: ["sighting-reports", "active"],
    queryFn: fetchSightingReports,
  });


  const markers = useMemo<MapMarker[]>(() => {

    const lostMarkers: MapMarker[] =
      (lostReportsQuery.data ?? [])
        .filter((report) => report.last_seen_location)
        .map((report) => ({
          id: report.id,
          kind: "lost",
          longitude:
            report.last_seen_location!.coordinates[0],
          latitude:
            report.last_seen_location!.coordinates[1],
          report,
        }));


    const sightingMarkers: MapMarker[] =
      (sightingReportsQuery.data ?? [])
        .filter((report) => report.location)
        .map((report) => ({
          id: report.id,
          kind: "sighting",
          longitude:
            report.location!.coordinates[0],
          latitude:
            report.location!.coordinates[1],
          report,
        }));


    return [
      ...lostMarkers,
      ...sightingMarkers,
    ];

  }, [
    lostReportsQuery.data,
    sightingReportsQuery.data,
  ]);


  const markerGroups = useMemo(
    () => groupNearbyMarkers(markers),
    [markers],
  );


  return {
    markers,
    markerGroups,

    isLoading:
      lostReportsQuery.isLoading ||
      sightingReportsQuery.isLoading,

    isError:
      lostReportsQuery.isError ||
      sightingReportsQuery.isError,
  };
};