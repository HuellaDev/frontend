export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface Photo {
  id: string;
  url: string;
  is_primary: boolean;
}

export interface AnimalProfile {
  id: string;
  species: string;
  breed: string | null;
  animal_type: string | null;
  sex: string | null;
  estimated_age_months: number | null;
  size: string | null;
  main_color: string | null;
  secondary_color: string | null;
  collar: boolean | null;
  condition: string | null;
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
  contact_phone: string | null;
  status: string;
  last_seen_location: GeoPoint | null;
  search_radius_meters: number | null;
  reward_amount: string | null;
  anonymous: boolean;
  created_at: string;
  updated_at: string;
  AnimalProfile: AnimalProfile;
  user: ReportUser;
  Photos: Photo[];
}

export interface SightingReport {
  id: string;
  status: string;
  location: GeoPoint | null;
  anonymous: boolean;
  created_at: string;
  updated_at: string;
  AnimalProfile: AnimalProfile;
  user: ReportUser;
  Photos: Photo[];
}

export type MapMarkerKind = "lost" | "sighting";

export interface MapMarker {
  id: string;
  kind: MapMarkerKind;
  longitude: number;
  latitude: number;
  report: LostReport | SightingReport;
}

export interface MarkerGroup {
  key: string;
  longitude: number;
  latitude: number;
  markers: MapMarker[];
}