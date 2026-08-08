import type { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchOrganizationById } from "@/lib/organizationsApi";
import { Gallery } from "@/components/shared/detail";
import { HelpCenterInfo } from "@/components/help-center";

export const HelpCenterDetail = (): ReactElement => {
  const { id } = useParams<{ id: string }>();

  const {
    data: organization,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["helpCenter", id],
    queryFn: () => fetchOrganizationById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <div className="container py-8">Loading Help Center...</div>;
  }

  if (isError || !organization) {
    return <div className="container py-8">Help Center not found.</div>;
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mx-auto w-full max-w-4xl space-y-6 rounded-xl border border-border bg-background p-6 pb-10">
        <Gallery
          photos={organization.Photos}
          alt={organization.name}
          emptyIcon="mdi:domain"
          emptyLabel="No photos yet"
        />
        <HelpCenterInfo organization={organization} />
      </div>
    </div>
  );
};