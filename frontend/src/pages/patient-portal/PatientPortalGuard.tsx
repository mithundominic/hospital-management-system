// Responsibility: Route guard ensuring only Patient role users access patient portal

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Box, Text } from "@/components/ui";
import { patientPortalService } from "@/services/patientPortal.service";

interface PatientPortalGuardProps {
  children: React.ReactNode;
}

export const PatientPortalGuard = ({ children }: PatientPortalGuardProps) => {
  const { user, loading: authLoading } = useAuth();

  const { data, isLoading: roleLoading } = useQuery({
    queryKey: ["hasPatientRole", user?.id],
    queryFn: () => patientPortalService.checkHasPatientRole(),
    enabled: !!user,
  });

  if (authLoading || roleLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!data?.hasRole) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Text variant="error">
          Access Denied: You must have Patient role to access this portal.
        </Text>
      </Box>
    );
  }

  return <>{children}</>;
};

export default PatientPortalGuard;
