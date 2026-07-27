import api from "./api";
import type { Organization } from "../types/organization";

export const fetchOrganizations = async (): Promise<Organization[]> => {
  const { data } = await api.get<Organization[]>("/organizations");
  return data;
};