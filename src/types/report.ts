import type { Organization } from "./organization";


export type MapPopupItem =
  | {
      type: "report";
      marker: MapMarker;
    }
  | {
      type: "organization";
      organization: Organization;
    };


export interface MarkerGroup {
  key: string;
  longitude: number;
  latitude: number;
  items: MapPopupItem[];
}