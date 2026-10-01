// Responsibility: Hook providing current user role and granular permissions for active hospital

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/useHospital";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";

interface UserHospitalPermissionsDto {
  role: string | null;
  permissions: string[];
}

export const usePermissions = () => {
  const { currentHospital } = useHospital();
  const { user } = useAuth();

  const isPlatformAdmin = Boolean(
    user?.app_metadata?.is_platform_admin ||
      user?.app_metadata?.platform_role === "SuperAdmin",
  );

  const { data, isLoading } = useQuery<UserHospitalPermissionsDto>({
    queryKey: ["my-permissions", currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital?.id) return { role: null, permissions: [] };
      return await api.get<UserHospitalPermissionsDto>(
        API_ROUTES.hospitals.myPermissions(currentHospital.id),
      );
    },
    enabled: !!currentHospital?.id && !!user,
    staleTime: 5 * 60 * 1000,
  });

  const permissions = data?.permissions || [];
  const role = data?.role || null;

  const hasPermission = useCallback(
    (permissionKey: string): boolean => {
      if (isPlatformAdmin) return true;
      return permissions.includes(permissionKey);
    },
    [isPlatformAdmin, permissions],
  );

  return {
    permissions,
    role,
    hasPermission,
    isPlatformAdmin,
    isLoading,
  } as const;
};
