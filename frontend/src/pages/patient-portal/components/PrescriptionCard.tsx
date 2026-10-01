// Responsibility: Card component displaying a single prescription with items

import { Card, Box, Text } from "@/components/ui";
import type { PatientPrescription } from "../patientPortal.types";
import { prescriptionFrequencyDisplay } from "../patientPortal.config";

interface PrescriptionCardProps {
  prescription: PatientPrescription;
}

export const PrescriptionCard = ({ prescription }: PrescriptionCardProps) => {
  return (
    <Card className="p-6">
      <Box className="space-y-4">
        <Box className="border-b pb-3">
          <Text size="lg" weight="semibold">
            {new Date(prescription.prescription_date).toLocaleDateString()}
          </Text>
          <Text size="sm" variant="muted">
            Dr. {prescription.encounter?.doctor_membership?.doctor?.full_name}
            {prescription.encounter?.doctor_membership?.doctor
              ?.specialization &&
              ` (${prescription.encounter.doctor_membership.doctor.specialization})`}
          </Text>
          {prescription.encounter?.diagnosis && (
            <Text size="sm" variant="muted" className="mt-1">
              Diagnosis: {prescription.encounter.diagnosis}
            </Text>
          )}
        </Box>

        <Box className="space-y-3">
          {prescription.prescription_items?.map((item) => (
            <Box key={item.id} className="bg-gray-50 p-3 rounded">
              <Text weight="semibold">{item.medication_name}</Text>
              <Text size="sm" className="text-gray-700">
                Dosage: {item.dosage} |{" "}
                {prescriptionFrequencyDisplay[item.frequency] || item.frequency}{" "}
                | {item.duration_days} days
              </Text>
              {item.instructions && (
                <Text size="sm" variant="muted" className="mt-1">
                  {item.instructions}
                </Text>
              )}
            </Box>
          ))}
        </Box>

        {prescription.notes && (
          <Text size="sm" variant="muted" className="italic border-t pt-3">
            Note: {prescription.notes}
          </Text>
        )}
      </Box>
    </Card>
  );
};
