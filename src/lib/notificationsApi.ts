import api from "./api";
import type { AppNotification } from "../types/notification";

export const fetchMyNotifications = async (): Promise<AppNotification[]> => {
  const { data } = await api.get<AppNotification[]>("/notifications");
  return data;
};

export const markNotificationAsRead = async (id: string): Promise<AppNotification> => {
  const { data } = await api.patch<AppNotification>(`/notifications/${id}/read`);
  return data;
};