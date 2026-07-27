import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  fetchLostReports,
  fetchSightingReports,
} from "../lib/reportsApi";

import { fetchOrganizations } from "../lib/organizationsApi";

import type {
  MapMarker,
  MarkerGroup,
  MapPopupItem,
} from "../types/report";



const groupItems = (
  items: MapPopupItem[],
): MarkerGroup[] => {

  const groups = new Map<string, MarkerGroup>();


  for (const item of items) {

    const longitude =
      item.type === "report"
        ? item.marker.longitude
        : item.organization.location!.coordinates[0];


    const latitude =
      item.type === "report"
        ? item.marker.latitude
        : item.organization.location!.coordinates[1];


    const key =
      `${latitude.toFixed(4)},${longitude.toFixed(4)}`;


    const existing = groups.get(key);


    if (existing) {

      existing.items.push(item);

    } else {

      groups.set(key, {
        key,
        longitude,
        latitude,
        items: [item],
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


  const organizationsQuery = useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
  });



  const markers = useMemo<MapMarker[]>(() => {


    const lostMarkers =
      (lostReportsQuery.data ?? [])
        .filter(
          (report) => report.last_seen_location,
        )
        .map((report) => ({
          id: report.id,
          kind: "lost" as const,
          longitude:
            report.last_seen_location!.coordinates[0],
          latitude:
            report.last_seen_location!.coordinates[1],
          report,
        }));



    const sightingMarkers =
      (sightingReportsQuery.data ?? [])
        .filter(
          (report) => report.location,
        )
        .map((report) => ({
          id: report.id,
          kind: "sighting" as const,
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




  const markerGroups = useMemo(() => {


    const items: MapPopupItem[] = [

      ...markers.map((marker) => ({
        type: "report" as const,
        marker,
      })),


      ...(organizationsQuery.data ?? [])
        .filter(
          (org) => org.location,
        )
        .map((organization) => ({
          type: "organization" as const,
          organization,
        })),


    ];


    return groupItems(items);


  }, [
    markers,
    organizationsQuery.data,
  ]);




  return {

    markers,

    markerGroups,


    isLoading:
      lostReportsQuery.isLoading ||
      sightingReportsQuery.isLoading ||
      organizationsQuery.isLoading,


    isError:
      lostReportsQuery.isError ||
      sightingReportsQuery.isError ||
      organizationsQuery.isError,

  };
};