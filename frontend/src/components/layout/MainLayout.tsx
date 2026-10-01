// Responsibility: Main responsive shell layout combining Sidebar, Header, and content outlet

import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Box } from "@/components/ui/Box";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { useHospital } from "@/contexts/useHospital";
import { usePlatform } from "@/contexts";
import { useHospitalBranding } from "@/lib/hooks/useHospitalBranding";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { APP_ROUTES } from "@/constants";

export const MainLayout = () => {
  const { user } = useAuth();
  const { hospitals, currentHospital, loading, initialized } = useHospital();
  const { isPlatformAdmin, loading: platformLoading } = usePlatform();
  const location = useLocation();
  useHospitalBranding();

  const isPlatformUser =
    isPlatformAdmin ||
    Boolean(
      user?.app_metadata?.is_platform_admin ||
      user?.app_metadata?.platform_role === "SuperAdmin" ||
      user?.app_metadata?.platform_role === "Support",
    );

  if (!initialized || loading || (platformLoading && !isPlatformUser)) {
    return <LoadingSpinner fullScreen />;
  }

  if (hospitals.length === 0 && !isPlatformUser) {
    return <Navigate to={APP_ROUTES.ONBOARDING} replace />;
  }

  if (
    isPlatformUser &&
    !currentHospital &&
    !location.pathname.startsWith("/platform")
  ) {
    return <Navigate to={APP_ROUTES.PLATFORM_HOSPITALS} replace />;
  }

  return (
    <Box className="min-h-screen bg-gray-50">
      <Sidebar />
      <Box className="lg:pl-64">
        <Header />
        <Box className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
