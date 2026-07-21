export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface AnimalProfile {
  id: string;
  species: string;
  breed: string | null;
  main_color: string | null;
  description: string | null;
}

export interface ReportUser {
  id: string;
  full_name: string;
  profile_photo: string | null;
}

export interface LostReport {
  id: string;
  pet_name: string | null;
  status: string;
  last_seen_location: GeoPoint | null;
  reward_amount: string | null;
  AnimalProfile: AnimalProfile;
  user: ReportUser;
}

export interface SightingReport {
  id: string;
  status: string;
  location: GeoPoint | null;
  AnimalProfile: AnimalProfile;
  user: ReportUser;
}

export type MapMarkerKind = "lost" | "sighting";

export interface MapMarker {
  id: string;
  kind: MapMarkerKind;
  longitude: number;
  latitude: number;
  report: LostReport | SightingReport;
}