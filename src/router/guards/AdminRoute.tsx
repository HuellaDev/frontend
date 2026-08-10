import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../hooks/useAuth";
import { fetchMyProfile } from "../../lib/profileApi";

interface AdminRouteProps {
  children: ReactElement;
}

export const AdminRoute = ({ children }: AdminRouteProps): ReactElement => {
  const { session, isLoading: isAuthLoading } = useAuth();

  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
    enabled: Boolean(session),
    retry: false,
  });

  if (isAuthLoading || (session && profileQuery.isLoading)) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (profileQuery.data?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};