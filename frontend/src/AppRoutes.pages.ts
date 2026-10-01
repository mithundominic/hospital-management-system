// Responsibility: Lazy-loaded page component imports for route definitions

import { lazy } from "react";

export const HomePage = lazy(() => import("@/pages/home/HomePage"));
export const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
export const OnboardingPage = lazy(
  () => import("@/pages/onboarding/OnboardingPage"),
);
export const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
export const PatientsPage = lazy(() => import("@/pages/patients/PatientsPage"));
export const PatientDetailPage = lazy(
  () => import("@/pages/patients/PatientDetailPage"),
);
export const AppointmentsPage = lazy(
  () => import("@/pages/appointments/AppointmentsPage"),
);
export const EncountersPage = lazy(
  () => import("@/pages/encounters/EncountersPage"),
);
export const LabOrdersPage = lazy(() => import("@/pages/lab/LabOrdersPage"));
export const PharmacyPage = lazy(() => import("@/pages/pharmacy/PharmacyPage"));
export const BillingPage = lazy(() => import("@/pages/billing/BillingPage"));
export const InsurancePage = lazy(
  () => import("@/pages/insurance/InsurancePage"),
);
export const IPDPage = lazy(() => import("@/pages/ipd/IPDPage"));
export const StaffPage = lazy(() => import("@/pages/staff/StaffPage"));
export const ShiftsPage = lazy(() => import("@/pages/shifts/ShiftsPage"));
export const ReportsPage = lazy(() => import("@/pages/reports/ReportsPage"));
export const AnalyticsPage = lazy(
  () => import("@/pages/analytics/AnalyticsDashboardPage"),
);
export const AttendancePage = lazy(
  () => import("@/pages/attendance/AttendancePage"),
);
export const LeavePage = lazy(() => import("@/pages/attendance/LeavePage"));
export const BiometricDevicesPage = lazy(
  () => import("@/pages/biometric/BiometricDevicesPage"),
);
export const PlatformHospitalsPage = lazy(
  () => import("@/pages/platform/PlatformHospitalsPage"),
);
export const PlatformAnalyticsPage = lazy(
  () => import("@/pages/platform/PlatformAnalyticsPage"),
);
export const HospitalSettingsPage = lazy(
  () => import("@/pages/settings/HospitalSettingsPage"),
);
export const PatientDashboardPage = lazy(
  () => import("@/pages/patient-portal/PatientDashboardPage"),
);
export const PatientAppointmentsPage = lazy(
  () => import("@/pages/patient-portal/PatientAppointmentsPage"),
);
export const PatientLabResultsPage = lazy(
  () => import("@/pages/patient-portal/PatientLabResultsPage"),
);
export const PatientPrescriptionsPage = lazy(
  () => import("@/pages/patient-portal/PatientPrescriptionsPage"),
);
