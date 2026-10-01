// Responsibility: Encapsulate login form state, submission logic, and post-auth routing

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useHospital } from "@/contexts/useHospital";
import { getPlatformStatus } from "@/services/platform.service";
import { APP_ROUTES } from "@/constants";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { refreshHospitals } = useHospital();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authData = await signIn(email, password);
      const isPlatformUser = Boolean(
        authData?.user?.app_metadata?.is_platform_admin ||
        authData?.user?.app_metadata?.platform_role === "SuperAdmin" ||
        authData?.user?.app_metadata?.platform_role === "Support",
      );

      if (isPlatformUser) {
        navigate(APP_ROUTES.PLATFORM_HOSPITALS, { replace: true });
        return;
      }

      const token = authData?.session?.access_token;
      const status = await getPlatformStatus(token).catch(() => ({
        isPlatformAdmin: false,
      }));

      if (status.isPlatformAdmin) {
        navigate(APP_ROUTES.PLATFORM_HOSPITALS, { replace: true });
        return;
      }

      const list = await refreshHospitals();
      if (list.length === 0) {
        navigate(APP_ROUTES.ONBOARDING, { replace: true });
      } else {
        navigate(APP_ROUTES.DASHBOARD, { replace: true });
      }
    } catch {
      // Error notification handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  } as const;
};
