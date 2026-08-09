import type { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchOrganizationById } from "@/lib/organizationsApi";

import type { Photo } from "@/types/report";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  MapPin,
  Phone,
  BadgeCheck,
  CircleAlert,
  User,
  Image,
} from "lucide-react";

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
    return (
      <div className="container py-8">
        Loading Help Center...
      </div>
    );
  }

  if (isError || !organization) {
    return (
      <div className="container py-8">
        Help Center not found.
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">
              {organization.name}
            </CardTitle>

            {organization.verified ? (
              <Badge className="gap-2">
                <BadgeCheck size={16} />
                Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-2">
                <CircleAlert size={16} />
                Pending Verification
              </Badge>
            )}
          </div>

          <Badge variant="outline">
            {organization.type}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {organization.description && (
            <>
              <div>
                <h3 className="mb-2 font-semibold">
                  Description
                </h3>

                <p className="text-muted-foreground">
                  {organization.description}
                </p>
              </div>

              <Separator />
            </>
          )}

          {organization.address && (
            <div className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5" />

              <div>
                <p className="font-medium">
                  Address
                </p>

                <p className="text-muted-foreground">
                  {organization.address}
                </p>
              </div>
            </div>
          )}

          {organization.phone && (
            <div className="flex gap-3">
              <Phone className="mt-1 h-5 w-5" />

              <div>
                <p className="font-medium">
                  Phone
                </p>

                <p className="text-muted-foreground">
                  {organization.phone}
                </p>
              </div>
            </div>
          )}

          {organization.Profile && (
            <>
              <Separator />

              <div className="flex gap-3">
                <User className="mt-1 h-5 w-5" />

                <div>
                  <p className="font-medium">
                    Managed by
                  </p>

                  <p className="text-muted-foreground">
                    {organization.Profile.full_name}
                  </p>
                </div>
              </div>
            </>
          )}

          {organization.Photos.length > 0 && (
            <>
              <Separator />

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Image size={18} />

                  <h3 className="font-semibold">
                    Photos
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {organization.Photos.map((photo: Photo) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={organization.name}
                      className="aspect-square rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};