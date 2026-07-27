import type { GeoPoint } from "./report";

export interface Organization {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  type: string;
  location: GeoPoint | null;
  verified: boolean;
}