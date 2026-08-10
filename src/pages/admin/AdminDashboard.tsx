import { type ReactElement } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Check, X } from "lucide-react";
import { toast } from "sonner";

import {
  fetchPendingOrganizations,
  updateOrganizationStatus,
} from "../../lib/organizationsApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const AdminDashboard = (): ReactElement => {
  const queryClient = useQueryClient();

  const pendingQuery = useQuery({
    queryKey: ["pending-organizations"],
    queryFn: fetchPendingOrganizations,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      verification_status,
    }: {
      id: string;
      verification_status: "approved" | "rejected";
    }) =>
      updateOrganizationStatus(id, {
        verification_status,
        verified: verification_status === "approved",
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pending-organizations"] });
      toast.success(
        variables.verification_status === "approved"
          ? "Organización aprobada"
          : "Organización rechazada",
      );
    },
    onError: () => {
      toast.error("No se pudo actualizar la organización");
    },
  });

  const organizations = pendingQuery.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Panel de administración</h1>
        <p className="text-sm text-muted-foreground">
          Organizaciones pendientes de verificación
        </p>
      </div>

      {pendingQuery.isLoading && (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      )}

      {pendingQuery.isError && (
        <p className="text-sm text-red-600">
          Ocurrió un error al cargar las organizaciones pendientes.
        </p>
      )}

      {!pendingQuery.isLoading && organizations.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
          <Building2 className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No hay organizaciones pendientes por revisar.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {organizations.map((org) => {
          const isPending = statusMutation.isPending && statusMutation.variables?.id === org.id;

          return (
            <div
              key={org.id}
              className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{org.name}</p>
                  <Badge variant="secondary">{org.type}</Badge>
                </div>

                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {org.description ?? "Sin descripción"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {org.address ?? "Sin dirección"} · {org.phone ?? "Sin teléfono"}
                </p>

                {org.Profile && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Solicitado por {org.Profile.full_name}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    statusMutation.mutate({ id: org.id, verification_status: "rejected" })
                  }
                >
                  <X className="size-4" />
                  Rechazar
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    statusMutation.mutate({ id: org.id, verification_status: "approved" })
                  }
                >
                  <Check className="size-4" />
                  Aprobar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};