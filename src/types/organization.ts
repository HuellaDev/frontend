import type { GeoPoint, Photo } from "./report";

export interface Organization {
  id: string;

  name: string;

  address: string | null;

  phone: string | null;

  description: string | null;

  type: string;

  location: GeoPoint | null;

  verified: boolean;

  verification_status:
    | "pending"
    | "approved"
    | "rejected";

  Profile?: {
    id: string;
    full_name: string;
    profile_photo: string | null;
  };

  Photos: Photo[];
}