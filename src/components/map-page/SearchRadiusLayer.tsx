import type { ReactElement } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import circle from "@turf/circle";
import type { Feature, Polygon } from "geojson";
import type { MapMarker, LostReport } from "../../types/report";

interface SearchRadiusLayerProps {
  markers: MapMarker[];
}

export const SearchRadiusLayer = ({ markers }: SearchRadiusLayerProps): ReactElement | null => {
  const features: Feature<Polygon>[] = markers
    .filter((m) => m.kind === "lost")
    .map((m) => {
      const report = m.report as LostReport;
      if (!report.search_radius_meters) return null;

      return circle([m.longitude, m.latitude], report.search_radius_meters / 1000, {
        steps: 64,
        units: "kilometers",
      });
    })
    .filter((f): f is Feature<Polygon> => f !== null);

  if (features.length === 0) return null;

  return (
    <Source id="search-radius" type="geojson" data={{ type: "FeatureCollection", features }}>
      <Layer
        id="search-radius-fill"
        type="fill"
        paint={{ "fill-color": "#ef4444", "fill-opacity": 0.08 }}
      />
      <Layer
        id="search-radius-line"
        type="line"
        paint={{ "line-color": "#ef4444", "line-width": 1.5, "line-opacity": 0.4 }}
      />
    </Source>
  );
};