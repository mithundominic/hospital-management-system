// Responsibility: Centralized permission keys matching database RBAC seed

export const PERMISSIONS = {
  // Patients
  PATIENTS_READ: "patients.read",
  PATIENTS_WRITE: "patients.write",
  // Doctors
  DOCTORS_READ: "doctors.read",
  DOCTORS_WRITE: "doctors.write",
  // Departments
  DEPARTMENTS_READ: "departments.read",
  DEPARTMENTS_WRITE: "departments.write",
  // Appointments
  APPOINTMENTS_READ: "appointments.read",
  APPOINTMENTS_WRITE: "appointments.write",
  // Encounters
  ENCOUNTERS_READ: "encounters.read",
  ENCOUNTERS_WRITE: "encounters.write",
  // Prescriptions
  PRESCRIPTIONS_READ: "prescriptions.read",
  PRESCRIPTIONS_WRITE: "prescriptions.write",
  // Lab
  LAB_ORDERS_READ: "lab_orders.read",
  LAB_ORDERS_WRITE: "lab_orders.write",
  LAB_RESULTS_READ: "lab_results.read",
  LAB_RESULTS_WRITE: "lab_results.write",
  // Beds & Admissions
  BEDS_READ: "beds.read",
  BEDS_WRITE: "beds.write",
  ADMISSIONS_READ: "admissions.read",
  ADMISSIONS_WRITE: "admissions.write",
  // Pharmacy / Inventory
  INVENTORY_READ: "inventory.read",
  INVENTORY_WRITE: "inventory.write",
  // Memberships & Hospital Management
  MEMBERSHIPS_MANAGE: "memberships.manage",
  HOSPITAL_MANAGE: "hospital.manage",
  // Platform
  PLATFORM_MANAGE_HOSPITALS: "platform.manage_hospitals",
  PLATFORM_SUPPORT_ACCESS: "platform.support_access",
  // Billing & Claims
  BILLING_READ: "billing.read",
  BILLING_WRITE: "billing.write",
  INSURANCE_CLAIMS_READ: "insurance_claims.read",
  INSURANCE_CLAIMS_WRITE: "insurance_claims.write",
  // Shifts & Reports
  SHIFTS_READ: "shifts.read",
  SHIFTS_WRITE: "shifts.write",
  REPORTS_READ: "reports.read",
  // ABDM
  ABDM_READ: "abdm.read",
  ABDM_WRITE: "abdm.write",
  // Attendance & Leave
  ATTENDANCE_READ: "attendance.read",
  ATTENDANCE_WRITE: "attendance.write",
  LEAVE_READ: "leave.read",
  LEAVE_WRITE: "leave.write",
  // Biometric Devices
  DEVICES_MANAGE: "devices.manage",
  // Patient Portal Self-Service
  APPOINTMENTS_READ_OWN: "appointments.read_own",
  APPOINTMENTS_REQUEST: "appointments.request",
  LAB_READ_OWN: "lab.read_own",
  PRESCRIPTIONS_READ_OWN: "prescriptions.read_own",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
