// Responsibility: Modal preview and print dialog for GST-compliant hospital invoices

import { Printer } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { HospitalLetterhead } from "@/components/common/HospitalLetterhead";
import { HospitalDocumentFooter } from "@/components/common/HospitalDocumentFooter";
import { appConfig } from "@/configs";
import type { Invoice } from "@/types";

interface InvoicePrintModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoicePrintModal = ({ invoice, onClose }: InvoicePrintModalProps) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={Boolean(invoice)} onClose={onClose} title="Tax Invoice Preview" maxWidth="2xl">
      <Box className="p-6 bg-white print:p-0">
        <HospitalLetterhead
          documentTitle="TAX INVOICE / BILL"
          documentNumber={invoice.invoice_number}
          documentDate={invoice.invoice_date || new Date().toISOString().split("T")[0]}
          badgeVariant="success"
        />

        <Flex justify="between" className="my-4 p-3 bg-gray-50 rounded-lg text-xs">
          <Box>
            <Text variant="caption">Patient ID / Account:</Text>
            <Text weight="medium" className="font-mono">{invoice.patient_id}</Text>
          </Box>
          <Box className="text-right">
            <Text variant="caption">Payment Status:</Text>
            <Text weight="semibold" className="uppercase text-primary-700">{invoice.status}</Text>
          </Box>
        </Flex>

        <Box className="my-6 border border-gray-200 rounded-lg overflow-hidden">
          <Flex justify="between" className="p-3 bg-gray-100 font-semibold text-xs text-gray-700">
            <Text size="xs" weight="semibold">Description / Medical Service</Text>
            <Text size="xs" weight="semibold">Amount ({appConfig.currency.symbol})</Text>
          </Flex>
          <Flex justify="between" className="p-3 border-t border-gray-200 text-sm">
            <Text size="sm">Hospital Consultation & Clinical Services</Text>
            <Text size="sm" weight="medium">{invoice.total_amount.toLocaleString("en-IN")}</Text>
          </Flex>
          {invoice.tax_amount > 0 && (
            <Flex justify="between" className="p-2 bg-gray-50 text-xs text-gray-600 border-t border-gray-200">
              <Text size="xs">CGST / SGST Applicable</Text>
              <Text size="xs">+{invoice.tax_amount.toLocaleString("en-IN")}</Text>
            </Flex>
          )}
          <Flex justify="between" className="p-3 bg-primary-50 text-sm font-bold text-gray-900 border-t-2 border-primary-200">
            <Text weight="bold">Total Bill Amount</Text>
            <Text weight="bold" className="text-primary-700">{appConfig.currency.symbol}{invoice.total_amount.toLocaleString("en-IN")}</Text>
          </Flex>
        </Box>

        <HospitalDocumentFooter
          signatoryTitle="Billing Officer"
          disclaimerText="Medicines once dispensed cannot be returned. All disputes subject to local jurisdiction."
        />

        <Flex justify="end" gap={3} className="mt-6 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" icon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
            Print Invoice
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
};

export default InvoicePrintModal;
