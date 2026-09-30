// Responsibility: Dropdown selector for associating prescription with an active clinical encounter

import { Select } from "@/components/ui/Select";

interface PrescriptionEncounterSelectProps {
  value: string;
  onChange: (val: string) => void;
  encounters: Array<{ id: string; chief_complaint?: string; created_at?: string }>;
}

export const PrescriptionEncounterSelect = ({
  value,
  onChange,
  encounters,
}: PrescriptionEncounterSelectProps) => {
  const options = [
    { value: "", label: "Select Encounter" },
    ...encounters.map((enc) => ({
      value: enc.id,
      label: `${enc.chief_complaint || "General Visit"} (${enc.created_at ? new Date(enc.created_at).toLocaleDateString() : "N/A"})`,
    })),
  ];

  return (
    <Select
      label="Associated Encounter *"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
    />
  );
};
