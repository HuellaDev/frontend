import api from "./api";
import type { Comment } from "../types/comment";

type ReportType = "lost_report" | "sighting_report";

export const fetchComments = async (
  reportType: ReportType,
  reportId: string
): Promise<Comment[]> => {
  const { data } = await api.get<Comment[]>("/comments", {
    params: { report_type: reportType, report_id: reportId },
  });
  return data;
};

export const createComment = async (payload: {
  report_type: ReportType;
  report_id: string;
  comment: string;
}): Promise<Comment> => {
  const { data } = await api.post<Comment>("/comments", payload);
  return data;
};

export const deleteComment = async (id: string): Promise<void> => {
  await api.delete(`/comments/${id}`);
};