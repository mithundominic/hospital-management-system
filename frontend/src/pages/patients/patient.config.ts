// Responsibility: Patient table column, detail tabs, and UI configurations

import type { TableColumn } from "@/types/table.types";
import type { Patient } from "@/types";
import type { TabItem } from "@/components/ui/Tabs";

export type PatientDetailTabId = "encounters" | "labs" | "prescriptions";

export const PATIENT_TABLE_COLUMNS: TableColumn<
  Patient & { hospital_patient_number?: string }
>[] = [
  { key: "mrn", header: "MRN" },
  { key: "name", header: "Name" },
  { key: "age", header: "Age" },
  { key: "phone", header: "Phone" },
  { key: "blood_group", header: "Blood Group" },
  { key: "actions", header: "Actions", headerClassName: "text-right" },
];

export const PATIENT_DETAIL_TABS: readonly TabItem<PatientDetailTabId>[] = [
  { id: "encounters", label: "Recent Encounters" },
  { id: "labs", label: "Lab Results" },
  { id: "prescriptions", label: "Prescriptions" },
] as const;
