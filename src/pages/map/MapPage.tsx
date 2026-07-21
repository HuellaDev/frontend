import { useMemo, useState, type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { fetchLostReports, fetchSightingReports } from "../../lib/reportsApi";
import type { MapMarker } from "../../types/report";

const MERIDA_CENTER = { longitude: -89.6237, latitude: 20.9674 };
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export const MapPage = (): ReactElement => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

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

  return (
    <div className="flex h-[calc(100vh-73px)] w-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Map</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading reports..." : `${markers.length} active reports nearby`}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
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

      <div className="relative flex-1 overflow-hidden rounded-2xl border border-border">
        <Map
          initialViewState={{
            longitude: MERIDA_CENTER.longitude,
            latitude: MERIDA_CENTER.latitude,
            zoom: 12,
          }}
          mapStyle={MAP_STYLE}
          style={{ width: "100%", height: "100%" }}
        >
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