// Responsibility: Static definitions and metadata for hospital staff roles and permissions

export interface StaffRoleDefinition {
  name: string;
  label: string;
  description: string;
  permissions: number;
}

export const hospitalRoles: readonly StaffRoleDefinition[] = [
  {
    name: "HospitalAdmin",
    label: "Hospital Admin",
    description:
      "Full operational control, reads everything, manages staff and reports",
    permissions: 28,
  },
  {
    name: "Doctor",
    label: "Doctor",
    description:
      "Clinical documentation, prescriptions, lab orders, patient care",
    permissions: 17,
  },
  {
    name: "Nurse",
    label: "Nurse",
    description: "Ward care, vitals, admissions, patient monitoring",
    permissions: 14,
  },
  {
    name: "Receptionist",
    label: "Receptionist",
    description:
      "Patient registration, appointments, OPD billing, ABHA verification",
    permissions: 12,
  },
  {
    name: "BillingClerk",
    label: "Billing Clerk",
    description: "Invoicing, payments, insurance claims management",
    permissions: 8,
  },
  {
    name: "LabTech",
    label: "Lab Technician",
    description: "Lab order processing and result entry",
    permissions: 7,
  },
  {
    name: "Pharmacist",
    label: "Pharmacist",
    description: "Inventory management and medicine dispensing",
    permissions: 5,
  },
] as const;
