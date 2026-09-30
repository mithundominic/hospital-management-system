// Responsibility: Modal container for generating GST-compliant patient invoices and line items

import { Plus } from "lucide-react";
import { FormModal } from "@/components/common/FormModal";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { InvoiceHeaderFields } from "./InvoiceHeaderFields";
import { InvoiceLineItemRow } from "./InvoiceLineItemRow";
import { InvoiceTotalsSection } from "./InvoiceTotalsSection";
import { HospitalLetterhead } from "@/components/common/HospitalLetterhead";
import { useInvoiceForm } from "./useInvoiceForm";
import type { InvoiceFormModalProps } from "./invoice.types";

export const InvoiceFormModal = ({
  onClose,
  onSuccess,
  invoice,
}: InvoiceFormModalProps) => {
  const {
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
  } = useInvoiceForm(onClose, onSuccess, invoice);

  const patientOpts = [
    { value: "", label: "Select Patient" },
    ...patients.map((p) => ({ value: p.id, label: p.full_name })),
  ];

  return (
    <FormModal
      isOpen={true}
      onClose={onClose}
      title="Generate Invoice"
      maxWidth="2xl"
      onSubmit={handleSubmit}
      submitLabel="Generate Invoice"
      isLoading={loading}
    >
      <Box className="space-y-4">
        <HospitalLetterhead
          documentTitle="TAX INVOICE"
          documentDate={formData.invoice_date}
          badgeVariant="success"
        />
        <InvoiceHeaderFields
          formData={formData}
          setFormData={setFormData}
          patientOpts={patientOpts}
        />

        <Flex justify="between" align="center">
          <Text weight="semibold" size="sm">
            Line Items
          </Text>
          <Button
            variant="outline"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={addItem}
          >
            Add Item
          </Button>
        </Flex>

        <Box className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {items.map((it, idx) => (
            <InvoiceLineItemRow
              key={idx}
              item={it}
              index={idx}
              canRemove={items.length > 1}
              onUpdate={updateItem}
              onRemove={removeItem}
            />
          ))}
        </Box>

        <InvoiceTotalsSection totals={totals} />
      </Box>
    </FormModal>
  );
};

export default InvoiceFormModal;
