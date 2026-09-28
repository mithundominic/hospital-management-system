// Responsibility: Centralized system roles constants matching database seed

export const ROLES = {
  SUPER_ADMIN: "SuperAdmin",
  SUPPORT: "Support",
  HOSPITAL_ADMIN: "HospitalAdmin",
  DOCTOR: "Doctor",
  NURSE: "Nurse",
  RECEPTIONIST: "Receptionist",
  PHARMACIST: "Pharmacist",
  LAB_TECH: "LabTech",
  BILLING_CLERK: "BillingClerk",
} as const;

export type SystemRole = (typeof ROLES)[keyof typeof ROLES];
