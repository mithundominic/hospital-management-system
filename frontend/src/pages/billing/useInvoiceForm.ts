// Responsibility: Manage invoice form state, patient query, and API creation submission

import { useState, useCallback, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/HospitalContext";
import { createHospitalInvoice } from "@/services/billing.service";
import { getHospitalPatients } from "@/services/patient.service";
import { QUERY_KEYS } from "@/constants";
import type { Invoice } from "@/types";
import type { InvoiceFormData } from "./invoice.types";
import { useInvoiceItems } from "./useInvoiceItems";

export const useInvoiceForm = (
  onClose: () => void,
  onSuccess: () => void,
  invoice?: Invoice | null,
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormData>({
    patient_id: invoice?.patient_id || "",
    invoice_date: format(new Date(), "yyyy-MM-dd"),
    due_date: "",
    payment_terms: "immediate",
    notes: invoice?.notes || "",
  });

  const { items, totals, addItem, removeItem, updateItem } = useInvoiceItems();

  const { data: patients = [] } = useQuery<{ id: string; full_name: string }[]>(
    {
      queryKey: QUERY_KEYS.hospitals.patients(currentHospital?.id),
      queryFn: async () => {
        if (!currentHospital) return [];
        const records = await getHospitalPatients(currentHospital.id);
        return records.map((r) => ({
          id: r.patients.id,
          full_name: r.patients.full_name,
        }));
      },
      enabled: !!currentHospital,
    },
  );

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (!currentHospital) return;
      setLoading(true);
      try {
        const payload = {
          ...formData,
          subtotal_amount: totals.subtotal,
          tax_amount: totals.cgst + totals.sgst,
          total_amount: totals.total,
          items: items.map((it) => ({
            ...it,
            quantity: Number(it.quantity),
            unit_price: Number(it.unit_price),
            gst_rate: Number(it.gst_rate),
          })),
        };
        await createHospitalInvoice(currentHospital.id, payload);
        toast.success("Invoice generated successfully");
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to generate invoice";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, totals, items, onSuccess, onClose],
  );

  return {
    loading,
    formData,
    setFormData,
    items,
    totals,
    patients,
    addItem,
    removeItem,
    updateItem,
    handleSubmit,
  } as const;
};
