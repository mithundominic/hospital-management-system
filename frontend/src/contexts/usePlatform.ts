// Responsibility: Hook to access PlatformContext

import { createContext, useContext } from "react";

export interface PlatformContextValue {
  isPlatformAdmin: boolean;
  loading: boolean;
}

export const PlatformContext = createContext<PlatformContextValue | undefined>(
  undefined,
);

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
};
