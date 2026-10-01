// Responsibility: Platform admin status detection and permission checking

import { createContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { getPlatformStatus } from "@/services/platform.service";

export interface PlatformContextValue {
  isPlatformAdmin: boolean;
  loading: boolean;
}

export const PlatformContext = createContext<PlatformContextValue | undefined>(
  undefined,
);

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

    const isMetaAdmin = Boolean(
      user.app_metadata?.is_platform_admin ||
      user.app_metadata?.platform_role === "SuperAdmin" ||
      user.app_metadata?.platform_role === "Support",
    );

    if (isMetaAdmin) {
      setIsPlatformAdmin(true);
      setLoading(false);
    }

    let isMounted = true;
    getPlatformStatus()
      .then((status) => {
        if (isMounted) {
          setIsPlatformAdmin(status.isPlatformAdmin || isMetaAdmin);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsPlatformAdmin(isMetaAdmin);
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
