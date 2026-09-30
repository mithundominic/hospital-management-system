// Responsibility: Route guard ensuring only Patient role users access patient portal

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Box } from "@/components/ui/Box";

interface PatientPortalGuardProps {
  children: React.ReactNode;
}

export const PatientPortalGuard = ({ children }: PatientPortalGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Check if user has Patient role via memberships query
  // For now, allow all authenticated users (will be enforced by backend RLS)

  return <>{children}</>;
};

export default PatientPortalGuard;
