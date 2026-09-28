// Responsibility: Render vital signs input fields in clinical encounter form

import { Activity } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import type { EncounterFormData } from "./encounter.types";

export interface EncounterVitalsSectionProps {
  formData: EncounterFormData;
  onUpdate: <K extends keyof EncounterFormData>(
    key: K,
    val: EncounterFormData[K],
  ) => void;
}

export const EncounterVitalsSection = ({
  formData,
  onUpdate,
}: EncounterVitalsSectionProps) => {
  return (
    <Box className="p-4 bg-gray-50 rounded-lg space-y-3">
      <Flex align="center" gap={2}>
        <Activity className="h-4 w-4 text-primary-600" />
        <Heading level={4} className="text-sm font-semibold text-gray-900">
          Vital Signs
        </Heading>
      </Flex>
      <Grid cols={3} gap={3}>
        <Input
          label="Systolic BP"
          placeholder="120"
          value={formData.blood_pressure_systolic}
          onChange={(e) => onUpdate("blood_pressure_systolic", e.target.value)}
        />
        <Input
          label="Diastolic BP"
          placeholder="80"
          value={formData.blood_pressure_diastolic}
          onChange={(e) => onUpdate("blood_pressure_diastolic", e.target.value)}
        />
        <Input
          label="Pulse (bpm)"
          placeholder="72"
          value={formData.pulse_rate}
          onChange={(e) => onUpdate("pulse_rate", e.target.value)}
        />
        <Input
          label="Temp (°F)"
          placeholder="98.6"
          value={formData.temperature}
          onChange={(e) => onUpdate("temperature", e.target.value)}
        />
        <Input
          label="SpO2 (%)"
          placeholder="98"
          value={formData.oxygen_saturation}
          onChange={(e) => onUpdate("oxygen_saturation", e.target.value)}
        />
        <Input
          label="Weight (kg)"
          placeholder="70"
          value={formData.weight}
          onChange={(e) => onUpdate("weight", e.target.value)}
        />
      </Grid>
    </Box>
  );
};
