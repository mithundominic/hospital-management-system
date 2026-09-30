// Responsibility: Hook managing state and update workflow for hospital branding and settings

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useHospital } from "@/contexts/useHospital";
import { updateHospital } from "@/services/hospital.service";
import type { Hospital } from "@/types/hospital";
import toast from "react-hot-toast";

export type HospitalSettingsFormState = Partial<Hospital>;

export const useHospitalSettingsForm = () => {
  const { currentHospital, setCurrentHospital, refreshHospitals } = useHospital();
  const [form, setForm] = useState<HospitalSettingsFormState>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentHospital) {
      setForm({
        name: currentHospital.name || "",
        tagline: currentHospital.tagline || "",
        logo_url: currentHospital.logo_url || "",
        brand_color: currentHospital.brand_color || "#2563eb",
        phone: currentHospital.phone || "",
        email: currentHospital.email || "",
        website: currentHospital.website || "",
        address: currentHospital.address || "",
        city: currentHospital.city || "",
        state: currentHospital.state || "",
        pincode: currentHospital.pincode || "",
        registration_number: currentHospital.registration_number || "",
        gst_number: currentHospital.gst_number || "",
        nabh_number: currentHospital.nabh_number || "",
        prescription_footer: currentHospital.prescription_footer || "",
        invoice_notes: currentHospital.invoice_notes || "",
      });
    }
  }, [currentHospital]);

  const update = useCallback((key: keyof Hospital, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!currentHospital?.id) {
        toast.error("No active hospital selected");
        return;
      }
      if (!form.name?.trim()) {
        toast.error("Hospital name is required");
        return;
      }

      setLoading(true);
      try {
        const updated = await updateHospital(currentHospital.id, form);
        setCurrentHospital(updated);
        await refreshHospitals();
        toast.success("Hospital branding & settings saved successfully!");
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to update hospital settings");
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, form, setCurrentHospital, refreshHospitals],
  );

  return { form, update, loading, handleSubmit, currentHospital } as const;
};
