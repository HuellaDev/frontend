export interface Comment {
  id: string;
  user_id: string;
  report_type: "lost_report" | "sighting_report";
  report_id: string;
  comment: string | null;
  photo_url: string | null;
  created_at: string;
  Profile: {
    id: string;
    full_name: string;
    profile_photo: string | null;
  };
}