import { useQuery } from "@tanstack/react-query";
import { fetchOrganizations } from "@/lib/organizationsApi";

export const useMapOrganizations = () => {
  const query = useQuery({
    queryKey: ["map-organizations"],
    queryFn: fetchOrganizations,
  });

  const organizations = query.data ?? [];

  return {
    organizations,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};