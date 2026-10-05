// Responsibility: Hook managing state and submission workflow for hospital onboarding

import { useState, useCallback, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useHospital } from "@/contexts/useHospital";
import { useOrganization } from "@/contexts/useOrganization";
import { onboardHospital } from "@/services/hospital.service";
import { APP_ROUTES } from "@/constants";
import toast from "react-hot-toast";

export interface OnboardingFormState {
  name: string;
  regNo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export const useOnboardingForm = () => {
  const { setCurrentHospital, refreshHospitals } = useHospital();
  const { refreshOrganizations } = useOrganization();
  const navigate = useNavigate();

  const [form, setForm] = useState<OnboardingFormState>({
    name: "",
    regNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const update = useCallback((k: keyof OnboardingFormState, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!form.name.trim()) return toast.error("Hospital name is required");
      if (!email.trim() || !email.includes("@"))
        return toast.error("Valid administrator email is required");
      if (password.length < 6)
        return toast.error("Password must be at least 6 characters");

      setLoading(true);
      try {
        const result = await onboardHospital({
          name: form.name.trim(),
          registration_number: form.regNo.trim() || undefined,
          address: form.address.trim() || undefined,
          city: form.city.trim() || undefined,
          state: form.state.trim() || undefined,
          pincode: form.pincode.trim() || undefined,
          admin_email: email.trim(),
          admin_password: password,
        });

        if (result.session) {
          await supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          });
        }

        await refreshOrganizations();
        await refreshHospitals();
        setCurrentHospital(result.hospital);
        toast.success("Hospital onboarded successfully!");
        navigate(APP_ROUTES.DASHBOARD);
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : "Failed to onboard hospital",
        );
      } finally {
        setLoading(false);
      }
    },
    [form, email, password, refreshHospitals, setCurrentHospital, navigate],
  );

  return {
    form,
    update,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
    navigateToLogin: () => navigate(APP_ROUTES.LOGIN),
  } as const;
};
