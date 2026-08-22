import api from "./api";

export interface MyProfile {
  id: string;
  full_name: string;
  phone: string | null;
  profile_photo: string | null;
  role: string;
  verified: boolean;
}

export const fetchMyProfile = async (): Promise<MyProfile> => {
  const { data } = await api.get<{ profile: MyProfile }>("/profile/me");
  return data.profile;
};


export const createMyProfile = async (payload: {
  full_name: string;
}) => {
  const { data } = await api.post("/profile", payload);
  return data;
};


export const updateMyProfile = async (payload: {
  full_name?: string;
  phone?: string;
}): Promise<MyProfile> => {
  const { data } = await api.patch<MyProfile>("/profile/me", payload);
  return data;
};


export const deleteMyAccount = async (): Promise<void> => {
  await api.delete("/profile/me");
};


export const uploadMyProfilePhoto = async (file: File): Promise<MyProfile> => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post<MyProfile>(
    "/profile/me/photo",
    formData
  );

  return data;
};