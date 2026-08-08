import api from "./api";
import type { Organization } from "../types/organization";

export interface CreateOrganizationPayload {
  name: string;
  type: string;
  address?: string;
  phone?: string;
  description?: string;

  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

export const fetchOrganizations = async (): Promise<Organization[]> => {
  const { data } = await api.get("/organizations");
  return data;
};

export const fetchOrganizationById = async (
  id: string,
): Promise<Organization> => {
  const { data } = await api.get(`/organizations/${id}`);

  return data;
};

export const createOrganization = async (
  payload: CreateOrganizationPayload,
): Promise<Organization> => {
  const { data } = await api.post("/organizations", payload);

  return data;
};

export const uploadOrganizationPhoto = async (
  photo: File,
  organizationId: string,
) => {
  const formData = new FormData();

  formData.append("photo", photo);
  formData.append("organization_id", organizationId);
  formData.append("is_primary", "true");

  await api.post("/photos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};