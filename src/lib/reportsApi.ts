import api from "./api";
import type { LostReport, SightingReport } from "../types/report";

export const fetchLostReports = async (): Promise<LostReport[]> => {
  const { data } = await api.get<LostReport[]>("/lost-reports", {
    params: { status: "active" },
  });
  return data;
};

export const fetchSightingReports = async (): Promise<SightingReport[]> => {
  const { data } = await api.get<SightingReport[]>("/sighting-reports", {
    params: { status: "active" },
  });
  return data;
};

export interface CreateReportPayload {
  species: string;
  breed?: string;
  main_color?: string;
  description?: string;
  pet_name?: string;
  contact_phone?: string;
  reward_amount?: number;
  coordinates: [number, number];
}

export const createLostReport = async (payload: CreateReportPayload) => {
  const { coordinates, ...rest } = payload;
  const { data } = await api.post("/lost-reports", {
    ...rest,
    last_seen_location: { type: "Point", coordinates },
  });
  return data;
};

export const createSightingReport = async (payload: CreateReportPayload) => {
  const { coordinates, ...rest } = payload;
  const { data } = await api.post("/sighting-reports", {
    ...rest,
    location: { type: "Point", coordinates },
  });
  return data;
};

export const uploadReportPhoto = async (
  file: File,
  reportId: string,
  kind: "lost" | "sighting"
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(kind === "lost" ? "lost_report_id" : "sighting_report_id", reportId);
  formData.append("is_primary", "true");

  const { data } = await api.post("/photos", formData);
  return data;
};