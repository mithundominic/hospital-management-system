// Responsibility: React context managing available hospitals and current active hospital selection

import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getHospitals } from "@/services/hospital.service";
import type { Hospital, HospitalContextType } from "@/types/hospital";

export type { Hospital, HospitalContextType };

export const HospitalContext = createContext<HospitalContextType | undefined>(
  undefined,
);

export const HospitalProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
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
      const msg = err instanceof Error ? err.message : "Failed to load hospitals";
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

    if (location.pathname === "/login" || location.pathname === "/onboarding") {
      return;
    }

    loadHospitals();
  }, [user, location.pathname]);

  return (
    <HospitalContext.Provider
      value={{
        hospitals,
        currentHospital,
        setCurrentHospital,
        refreshHospitals: loadHospitals,
        loading,
        initialized,
        error,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};
