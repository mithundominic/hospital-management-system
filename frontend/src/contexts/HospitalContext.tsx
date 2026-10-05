// Responsibility: React context managing available hospitals and current active hospital selection

import { useEffect, useState, useMemo, type ReactNode } from "react";
import { useAuth } from "./useAuth";
import { useOrganization } from "./useOrganization";
import { getHospitals } from "@/services/hospital.service";
import type { Hospital, HospitalContextType } from "@/types/hospital";
import { HospitalContext } from "./useHospital";

export const HospitalProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [currentHospital, setCurrentHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHospitals = async (): Promise<Hospital[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHospitals();
      const list = data || [];
      setHospitals(list);

      if (list.length > 0) {
        setCurrentHospital((prev) => {
          if (!prev) return list[0];
          const found = list.find((h) => h.id === prev.id);
          return found || list[0];
        });
      } else {
        setCurrentHospital(null);
      }
      return list;
    } catch (err) {
      console.error("Failed to load hospitals:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to load hospitals";
      setError(msg);
      return [];
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    if (!user) {
      setHospitals([]);
      setCurrentHospital(null);
      setLoading(false);
      setInitialized(false);
      setError(null);
      return;
    }

    if (!initialized) {
      loadHospitals();
    }
  }, [user, initialized]);

  useEffect(() => {
    if (!currentOrganization || hospitals.length === 0) return;
    const orgHospitals = hospitals.filter(
      (h) => h.tenant_id === currentOrganization.id,
    );
    if (orgHospitals.length > 0) {
      if (!currentHospital || currentHospital.tenant_id !== currentOrganization.id) {
        setCurrentHospital(orgHospitals[0]);
      }
    }
  }, [currentOrganization, hospitals, currentHospital]);

  const value = useMemo(
    () => ({
      hospitals,
      currentHospital,
      setCurrentHospital,
      refreshHospitals: loadHospitals,
      loading,
      initialized,
      error,
    }),
    [hospitals, currentHospital, loading, initialized, error],
  );

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};
