// Responsibility: React context managing available hospitals and current active hospital selection

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getHospitals } from "@/services/hospital.service";

export interface Hospital {
  id: string;
  name: string;
  registration_number: string;
  address: string;
  phone: string;
  email: string;
}

export interface HospitalContextType {
  hospitals: Hospital[];
  currentHospital: Hospital | null;
  setCurrentHospital: (hospital: Hospital) => void;
  loading: boolean;
}

const HospitalContext = createContext<HospitalContextType | undefined>(
  undefined,
);

export const HospitalProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [currentHospital, setCurrentHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHospitals();
    } else {
      setHospitals([]);
      setCurrentHospital(null);
      setLoading(false);
    }
  }, [user]);

  const loadHospitals = async () => {
    try {
      const data = await getHospitals();
      setHospitals(data || []);

      if (data && data.length > 0 && !currentHospital) {
        setCurrentHospital(data[0]);
      }
    } catch (error) {
      console.error("Failed to load hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HospitalContext.Provider
      value={{
        hospitals,
        currentHospital,
        setCurrentHospital,
        loading,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};
