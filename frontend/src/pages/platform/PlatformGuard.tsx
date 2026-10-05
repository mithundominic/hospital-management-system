// Responsibility: Route guard ensuring only platform administrators access platform routes

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { usePlatform } from "@/contexts";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { APP_ROUTES } from "@/constants";

interface PlatformGuardProps {
  children: ReactNode;
}

export const PlatformGuard = ({ children }: PlatformGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isPlatformAdmin, loading: platformLoading } = usePlatform();

  if (authLoading || platformLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  if (!isPlatformAdmin) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default PlatformGuard;
