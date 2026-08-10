import { useMemo, useState, type ReactElement } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Search } from "lucide-react";
import { toast } from "sonner";

import {
  fetchOrganizationsByStatus,
  updateOrganizationStatus,
  type OrganizationStatus,
} from "@/lib/organizationsApi";
import { OrganizationCard } from "@/components/admin";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS: { value: OrganizationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

const EMPTY_MESSAGES: Record<OrganizationStatus, string> = {
  pending: "No pending organizations to review.",
  approved: "No verified organizations yet.",
  rejected: "No rejected organizations.",
};

export const AdminDashboard = (): ReactElement => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<OrganizationStatus>("pending");
  const [search, setSearch] = useState("");

  const organizationsQuery = useQuery({
    queryKey: ["organizations", activeTab],
    queryFn: () => fetchOrganizationsByStatus(activeTab),
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
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(
        variables.verification_status === "approved"
          ? "Organization approved"
          : "Organization rejected",
      );
    },
    onError: () => {
      toast.error("Could not update the organization");
    },
  });

  const organizations = organizationsQuery.data ?? [];

  const filteredOrganizations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return organizations;

    return organizations.filter((org) =>
      [org.name, org.address, org.Profile?.full_name]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query)),
    );
  }, [organizations, search]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Admin panel</h1>
        <p className="text-sm text-muted-foreground">
          Manage shelters and organizations
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as OrganizationStatus)}
      >
        <TabsList className="grid w-full grid-cols-3">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, address, or requester..."
            className="pl-9"
          />
        </div>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4 flex flex-col gap-3">
            {organizationsQuery.isLoading && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}

            {organizationsQuery.isError && (
              <p className="text-sm text-red-600">
                Something went wrong while loading organizations.
              </p>
            )}

            {!organizationsQuery.isLoading && filteredOrganizations.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
                <Building2 className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {search ? "No results match your search." : EMPTY_MESSAGES[tab.value]}
                </p>
              </div>
            )}

            {filteredOrganizations.map((org) => {
              const isMutating =
                statusMutation.isPending && statusMutation.variables?.id === org.id;

              return (
                <OrganizationCard
                  key={org.id}
                  organization={org}
                  showActions={tab.value === "pending"}
                  isMutating={isMutating}
                  onApprove={() =>
                    statusMutation.mutate({ id: org.id, verification_status: "approved" })
                  }
                  onReject={() =>
                    statusMutation.mutate({ id: org.id, verification_status: "rejected" })
                  }
                />
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};