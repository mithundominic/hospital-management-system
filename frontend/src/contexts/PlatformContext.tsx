// Responsibility: Platform admin status detection and permission checking

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { PERMISSIONS } from "@/constants";

interface PlatformContextValue {
  isPlatformAdmin: boolean;
  hasManageHospitals: boolean;
  hasSupportAccess: boolean;
}

const PlatformContext = createContext<PlatformContextValue | undefined>(
  undefined,
);

export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const isPlatformAdmin = false;
  const hasManageHospitals = false;
  const hasSupportAccess = false;

  return (
    <PlatformContext.Provider
      value={{ isPlatformAdmin, hasManageHospitals, hasSupportAccess }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
};
