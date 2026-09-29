// Responsibility: TypeScript interfaces for lab orders, results, and order forms

export interface LabOrderFormData {
  encounter_id: string;
  test_name: string;
  sample_type: string;
  priority: "routine" | "urgent" | "stat";
  instructions: string;
}

export interface LabEncounterOption {
  value: string;
  label: string;
}
