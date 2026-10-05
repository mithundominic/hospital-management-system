// Responsibility: Hook for consuming HospitalContext

import { createContext, useContext } from "react";
import type { HospitalContextType } from "@/types/hospital";

export const HospitalContext = createContext<HospitalContextType | undefined>(
  undefined,
);

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};
