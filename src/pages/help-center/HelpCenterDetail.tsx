import { useState, type ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchOrganizationById,
  uploadOrganizationPhotos,
  deleteOrganizationPhoto,
} from "@/lib/organizationsApi";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { Gallery } from "@/components/shared/detail";
import { HelpCenterInfo } from "@/components/help-center";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const HelpCenterDetail = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [galleryError, setGalleryError] = useState<string | null>(null);

  const {
    data: organization,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["helpCenter", id],
    queryFn: () => fetchOrganizationById(id!),
    enabled: Boolean(id),
  });

  const isOwner = Boolean(
    session?.user.id && organization?.user_id === session.user.id,
  );

  const invalidateOrganization = (): void => {
    queryClient.invalidateQueries({ queryKey: ["helpCenter", id] });
  };

  const addPhotosMutation = useMutation({
    mutationFn: (files: File[]) => uploadOrganizationPhotos(files, id!),
    onSuccess: (results) => {
      const failed = results.filter((r) => r.status === "rejected");

      setGalleryError(
        failed.length > 0
          ? `${failed.length} of ${results.length} photo(s) failed to upload.`
          : null,
      );

      invalidateOrganization();
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: string) => deleteOrganizationPhoto(photoId),
    onSuccess: () => {
      setGalleryError(null);
      invalidateOrganization();
    },
    onError: (error) => {
      setGalleryError(getErrorMessage(error, "Could not delete photo."));
    },
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
        {galleryError && (
          <Alert variant="destructive">
            <AlertDescription>{galleryError}</AlertDescription>
          </Alert>
        )}

        <Gallery
          photos={organization.Photos}
          alt={organization.name}
          emptyIcon="mdi:domain"
          emptyLabel="No photos yet"
          editable={isOwner}
          isUploading={addPhotosMutation.isPending}
          onAddPhotos={(files) => addPhotosMutation.mutate(files)}
          onDeletePhoto={(photoId) => deletePhotoMutation.mutate(photoId)}
        />

        <HelpCenterInfo organization={organization} />
      </div>
    </div>
  );
};