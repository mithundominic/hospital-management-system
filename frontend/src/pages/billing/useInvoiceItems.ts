// Responsibility: Manage invoice line item state, mutations, and calculated tax totals

import { useState, useCallback, useMemo } from "react";
import type { InvoiceLineItemForm } from "./invoice.types";
import {
  calculateInvoiceTotals,
  initialInvoiceLineItem,
} from "./invoice.utils";

export const useInvoiceItems = () => {
  const [items, setItems] = useState<InvoiceLineItemForm[]>([
    initialInvoiceLineItem,
  ]);

  const totals = useMemo(() => calculateInvoiceTotals(items), [items]);

  const addItem = useCallback(
    () => setItems((prev) => [...prev, { ...initialInvoiceLineItem }]),
    [],
  );

  const removeItem = useCallback((idx: number) => {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev,
    );
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

  return { items, totals, addItem, removeItem, updateItem } as const;
};
