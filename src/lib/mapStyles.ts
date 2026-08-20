import type { MapStyleKey } from "@/components/map-page";

export const DEFAULT_CENTER = {
  longitude: -89.6237,
  latitude: 20.9674,
};

export const MAP_STYLES: Record<
  MapStyleKey,
  { label: string; url: string }
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