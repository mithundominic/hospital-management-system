// Responsibility: Hook for consuming HospitalContext

import { useContext } from "react";
import { HospitalContext } from "./HospitalContext";

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};
