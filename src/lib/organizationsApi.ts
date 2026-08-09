import api from "./api";
import type { Organization } from "../types/organization";
import type { Photo } from "../types/report";

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

export const fetchOrganizationById = async (id: string): Promise<Organization> => {
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
  isPrimary = false,
): Promise<Photo> => {
  const formData = new FormData();

  formData.append("file", photo);
  formData.append("organization_id", organizationId);
  formData.append("is_primary", String(isPrimary));

  const { data } = await api.post("/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export interface PhotoUploadResult {
  file: File;
  status: "fulfilled" | "rejected";
  photo?: Photo;
  error?: unknown;
}

export const uploadOrganizationPhotos = async (
  photos: File[],
  organizationId: string,
): Promise<PhotoUploadResult[]> => {
  const settled = await Promise.allSettled(
    photos.map((file, index) =>
      uploadOrganizationPhoto(file, organizationId, index === 0),
    ),
  );

  return settled.map((result, index) => ({
    file: photos[index],
    status: result.status,
    photo: result.status === "fulfilled" ? result.value : undefined,
    error: result.status === "rejected" ? result.reason : undefined,
  }));
};

export const deleteOrganizationPhoto = async (photoId: string): Promise<void> => {
  await api.delete(`/photos/${photoId}`);
};