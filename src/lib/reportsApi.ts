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