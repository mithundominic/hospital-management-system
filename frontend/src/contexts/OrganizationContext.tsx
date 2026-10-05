// Responsibility: React context managing available organizations and active organization selection

import { useEffect, useState, useMemo, type ReactNode } from "react";
import { useAuth } from "./useAuth";
import { organizationService } from "@/services/organization.service";
import type { UserOrganization } from "@/types/organization";
import type { Hospital } from "@/types/hospital";
import { OrganizationContext } from "./useOrganization";

export const OrganizationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [currentOrganization, setCurrentOrganization] =
    useState<UserOrganization | null>(null);
  const [facilities, setFacilities] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await organizationService.getUserOrganizations();
      const list = data || [];
      setOrganizations(list);

      if (list.length > 0) {
        setCurrentOrganization((prev) => {
          if (!prev) return list[0];
          const found = list.find((o) => o.id === prev.id);
          return found || list[0];
        });
      } else {
        setCurrentOrganization(null);
        setFacilities([]);
      }
    } catch (err) {
      console.error("Failed to load organizations:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to load organizations";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setOrganizations([]);
      setCurrentOrganization(null);
      setFacilities([]);
      setLoading(false);
      setError(null);
      return;
    }
    loadOrganizations();
  }, [user]);

  useEffect(() => {
    if (!currentOrganization) {
      setFacilities([]);
      return;
    }
    organizationService
      .getFacilities(currentOrganization.id)
      .then((facs) => setFacilities(facs || []))
      .catch((err) => console.error("Failed to load facilities for org:", err));
  }, [currentOrganization]);

  const value = useMemo(
    () => ({
      organizations,
      currentOrganization,
      setCurrentOrganization,
      facilities,
      refreshOrganizations: loadOrganizations,
      loading,
      error,
    }),
    [organizations, currentOrganization, facilities, loading, error],
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};
