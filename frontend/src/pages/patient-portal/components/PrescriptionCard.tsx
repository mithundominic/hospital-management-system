// Responsibility: Card component displaying a single prescription with items

import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
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
          <p className="text-lg font-semibold">
            {new Date(prescription.prescription_date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Dr. {prescription.encounter?.doctor_membership?.doctor?.full_name}
            {prescription.encounter?.doctor_membership?.doctor?.specialization &&
              ` (${prescription.encounter.doctor_membership.doctor.specialization})`}
          </p>
          {prescription.encounter?.diagnosis && (
            <p className="text-sm text-gray-500 mt-1">
              Diagnosis: {prescription.encounter.diagnosis}
            </p>
          )}
        </Box>

        <Box className="space-y-3">
          {prescription.prescription_items?.map((item) => (
            <Box key={item.id} className="bg-gray-50 p-3 rounded">
              <p className="font-semibold">{item.medication_name}</p>
              <p className="text-sm text-gray-700">
                Dosage: {item.dosage} |{" "}
                {prescriptionFrequencyDisplay[item.frequency] || item.frequency} |{" "}
                {item.duration_days} days
              </p>
              {item.instructions && (
                <p className="text-sm text-gray-600 mt-1">{item.instructions}</p>
              )}
            </Box>
          ))}
        </Box>

        {prescription.notes && (
          <Box className="text-sm text-gray-600 italic border-t pt-3">
            Note: {prescription.notes}
          </Box>
        )}
      </Box>
    </Card>
  );
};
