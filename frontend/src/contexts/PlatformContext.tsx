// Responsibility: Platform admin status detection and permission checking

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { getPlatformStatus } from "@/services/platform.service";

interface PlatformContextValue {
  isPlatformAdmin: boolean;
  loading: boolean;
}

const PlatformContext = createContext<PlatformContextValue | undefined>(undefined);

export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPlatformAdmin(false);
      setLoading(false);
      return;
    }

    let isMounted = true;
    getPlatformStatus()
      .then((status) => {
        if (isMounted) {
          setIsPlatformAdmin(status.isPlatformAdmin);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsPlatformAdmin(false);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <PlatformContext.Provider value={{ isPlatformAdmin, loading }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
};
