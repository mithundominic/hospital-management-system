// Responsibility: Modal preview and print dialog for electronic medical prescriptions

import { Printer } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { HospitalLetterhead } from "@/components/common/HospitalLetterhead";
import { HospitalDocumentFooter } from "@/components/common/HospitalDocumentFooter";
import { PrescriptionPrintRow } from "./PrescriptionPrintRow";
import type { PrescriptionItem } from "./prescription.types";

interface PrescriptionPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  encounterComplaint?: string;
  items: PrescriptionItem[];
}

export const PrescriptionPrintModal = ({
  isOpen,
  onClose,
  patientName = "Valued Patient",
  encounterComplaint,
  items,
}: PrescriptionPrintModalProps) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prescription Preview" maxWidth="2xl">
      <Box className="p-6 bg-white print:p-0">
        <HospitalLetterhead
          documentTitle="MEDICAL PRESCRIPTION (Rx)"
          documentNumber={`RX-${Date.now().toString().slice(-6)}`}
          documentDate={new Date().toLocaleDateString()}
          badgeVariant="success"
        />

        <Flex justify="between" className="my-4 p-3 bg-gray-50 rounded-lg text-xs">
          <Box>
            <Text variant="caption">Patient Name:</Text>
            <Text weight="bold" size="sm" className="text-gray-900">{patientName}</Text>
          </Box>
          {encounterComplaint && (
            <Box className="text-right">
              <Text variant="caption">Clinical Indication:</Text>
              <Text weight="medium" className="text-gray-700">{encounterComplaint}</Text>
            </Box>
          )}
        </Flex>

        <Box className="my-6 border border-gray-200 rounded-lg overflow-hidden">
          <Flex justify="between" className="p-3 bg-gray-100 font-semibold text-xs text-gray-700">
            <Text size="xs" weight="semibold">Medication (Generic/Brand)</Text>
            <Text size="xs" weight="semibold">Dosage & Frequency</Text>
            <Text size="xs" weight="semibold">Duration</Text>
          </Flex>
          {items.map((item, idx) => (
            <PrescriptionPrintRow key={idx} item={item} />
          ))}
        </Box>

        <HospitalDocumentFooter
          signatoryTitle="Registered Medical Practitioner (RMP)"
          disclaimerText="Generic drug substitution permitted as per National Medical Commission (NMC) regulations. Valid for 7 days."
        />

        <Flex justify="end" gap={3} className="mt-6 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" icon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
            Print Rx
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
};

export default PrescriptionPrintModal;
