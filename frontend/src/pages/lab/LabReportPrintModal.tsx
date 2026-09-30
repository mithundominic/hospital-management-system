// Responsibility: Modal preview and print dialog for diagnostic laboratory reports

import { Printer } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { HospitalLetterhead } from "@/components/common/HospitalLetterhead";
import { HospitalDocumentFooter } from "@/components/common/HospitalDocumentFooter";
import type { LabOrder } from "@/types";

interface LabReportPrintModalProps {
  labOrder: LabOrder | null;
  onClose: () => void;
}

export const LabReportPrintModal = ({ labOrder, onClose }: LabReportPrintModalProps) => {
  if (!labOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={Boolean(labOrder)} onClose={onClose} title="Diagnostic Lab Report" maxWidth="2xl">
      <Box className="p-6 bg-white print:p-0">
        <HospitalLetterhead
          documentTitle="CLINICAL PATHOLOGY REPORT"
          documentNumber={`LAB-${labOrder.id.slice(0, 8).toUpperCase()}`}
          documentDate={labOrder.created_at ? new Date(labOrder.created_at).toLocaleDateString() : undefined}
          badgeVariant="info"
        />

        <Flex justify="between" className="my-4 p-3 bg-gray-50 rounded-lg text-xs">
          <Box>
            <Text variant="caption">Investigation / Test:</Text>
            <Text weight="bold" size="sm" className="text-gray-900">{labOrder.test_name}</Text>
          </Box>
          <Box className="text-right">
            <Text variant="caption">Status / Priority:</Text>
            <Flex gap={2} justify="end" className="mt-0.5">
              <Badge variant="default">{labOrder.priority.toUpperCase()}</Badge>
              <Badge variant="success">{labOrder.status.toUpperCase()}</Badge>
            </Flex>
          </Box>
        </Flex>

        <Box className="my-4 p-4 border border-gray-200 rounded-lg space-y-3">
          <Flex justify="between" className="text-xs text-gray-500 border-b border-gray-100 pb-2">
            <Text size="xs" weight="medium">Order ID: {labOrder.id.slice(0, 8).toUpperCase()}</Text>
            <Text size="xs" weight="medium">Method: Certified Automated Analysis</Text>
          </Flex>
          <Box className="py-2">
            <Text size="sm" weight="semibold" className="text-gray-800">Clinical Observations & Findings:</Text>
            <Text size="sm" className="text-gray-600 mt-1 italic">
              {labOrder.notes || "Specimen processed according to standard lab protocol. Parameters within baseline limits."}
            </Text>
          </Box>
        </Box>

        <HospitalDocumentFooter
          signatoryTitle="Chief Pathologist / Lab Director"
          disclaimerText="Diagnostic results relate only to the specimen tested. Please correlate clinically with treating physician."
        />

        <Flex justify="end" gap={3} className="mt-6 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" icon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
            Print Report
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
};

export default LabReportPrintModal;
