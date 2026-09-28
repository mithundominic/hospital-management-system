// Responsibility: Manage invoice form state, item line additions, and API creation submission

import { useState, useCallback, useMemo, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type { Invoice } from "@/types";
import type { InvoiceFormData, InvoiceLineItemForm } from "./invoice.types";
import { calculateInvoiceTotals, initialInvoiceLineItem } from "./invoice.utils";

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
    due_date: "", payment_terms: "immediate", notes: invoice?.notes || "",
  });

  const [items, setItems] = useState<InvoiceLineItemForm[]>([initialInvoiceLineItem]);

  const { data: patients = [] } = useQuery<{ id: string; full_name: string }[]>({
    queryKey: QUERY_KEYS.hospitals.patients(currentHospital?.id),
    queryFn: () =>
      currentHospital
        ? api.get<{ id: string; full_name: string }[]>(API_ROUTES.hospitals.patients(currentHospital.id))
        : [],
    enabled: !!currentHospital,
  });

  const totals = useMemo(() => calculateInvoiceTotals(items), [items]);

  const addItem = useCallback(
    () => setItems((prev) => [...prev, { ...initialInvoiceLineItem }]),
    [],
  );

  const removeItem = useCallback((idx: number) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));
  }, []);

  const updateItem = useCallback(
    (idx: number, field: keyof InvoiceLineItemForm, val: string) => {
      setItems((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], [field]: val };
        return next;
      });
    },
    [],
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
        await api.post(API_ROUTES.hospitals.invoices(currentHospital.id), payload);
        toast.success("Invoice generated successfully");
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to generate invoice";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, totals, items, onSuccess, onClose],
  );

  return {
    loading, formData, setFormData, items, totals,
    patients, addItem, removeItem, updateItem, handleSubmit,
  } as const;
};
