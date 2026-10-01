// Responsibility: Route guard ensuring only Patient role users access patient portal

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Box } from "@/components/ui/Box";

interface PatientPortalGuardProps {
  children: React.ReactNode;
}

const checkPatientRole = async (userId: string) => {
  const { data, error } = await supabase
    .from("memberships")
    .select("role:roles!inner(name)")
    .eq("user_id", userId)
    .eq("role.name", "Patient")
    .eq("status", "active")
    .limit(1)
    .single();

  if (error || !data) return false;
  return true;
};

export const PatientPortalGuard = ({ children }: PatientPortalGuardProps) => {
  const { user, loading: authLoading } = useAuth();

  const { data: hasPatientRole, isLoading: roleLoading } = useQuery({
    queryKey: ["hasPatientRole", user?.id],
    queryFn: () => checkPatientRole(user!.id),
    enabled: !!user,
  });

  if (authLoading || roleLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPatientRole) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">
          Access Denied: You must have Patient role to access this portal.
        </p>
      </Box>
    );
  }

  return <>{children}</>;
};

export default PatientPortalGuard;
