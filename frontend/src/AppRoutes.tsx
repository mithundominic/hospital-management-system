// Responsibility: Define application route hierarchy and layout bindings

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { APP_ROUTES } from "@/constants";

const HomePage = lazy(() => import("@/pages/home/HomePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const OnboardingPage = lazy(() => import("@/pages/onboarding/OnboardingPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const PatientsPage = lazy(() => import("@/pages/patients/PatientsPage"));
const PatientDetailPage = lazy(
  () => import("@/pages/patients/PatientDetailPage"),
);
const AppointmentsPage = lazy(
  () => import("@/pages/appointments/AppointmentsPage"),
);
const EncountersPage = lazy(() => import("@/pages/encounters/EncountersPage"));
const LabOrdersPage = lazy(() => import("@/pages/lab/LabOrdersPage"));
const PharmacyPage = lazy(() => import("@/pages/pharmacy/PharmacyPage"));
const BillingPage = lazy(() => import("@/pages/billing/BillingPage"));
const InsurancePage = lazy(() => import("@/pages/insurance/InsurancePage"));
const IPDPage = lazy(() => import("@/pages/ipd/IPDPage"));
const StaffPage = lazy(() => import("@/pages/staff/StaffPage"));
const ShiftsPage = lazy(() => import("@/pages/shifts/ShiftsPage"));
const ReportsPage = lazy(() => import("@/pages/reports/ReportsPage"));
const AttendancePage = lazy(() => import("@/pages/attendance/AttendancePage"));
const LeavePage = lazy(() => import("@/pages/attendance/LeavePage"));
const BiometricDevicesPage = lazy(
  () => import("@/pages/biometric/BiometricDevicesPage"),
);
const PlatformHospitalsPage = lazy(
  () => import("@/pages/platform/PlatformHospitalsPage"),
);
const PlatformAnalyticsPage = lazy(
  () => import("@/pages/platform/PlatformAnalyticsPage"),
);
const HospitalSettingsPage = lazy(
  () => import("@/pages/settings/HospitalSettingsPage"),
);
const PatientDashboardPage = lazy(
  () => import("@/pages/patient-portal/PatientDashboardPage"),
);
const PatientAppointmentsPage = lazy(
  () => import("@/pages/patient-portal/PatientAppointmentsPage"),
);
const PatientLabResultsPage = lazy(
  () => import("@/pages/patient-portal/PatientLabResultsPage"),
);
const PatientPrescriptionsPage = lazy(
  () => import("@/pages/patient-portal/PatientPrescriptionsPage"),
);
const PatientPortalGuard = lazy(
  () => import("@/pages/patient-portal/PatientPortalGuard"),
);

const LoadingFallback = () => <LoadingSpinner size="lg" fullScreen />;

export const AppRoutes = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Routes>
      <Route path={APP_ROUTES.HOME} element={<HomePage />} />
      <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={APP_ROUTES.ONBOARDING} element={<OnboardingPage />} />
      <Route
        path={APP_ROUTES.REGISTER}
        element={<Navigate to={APP_ROUTES.ONBOARDING} replace />}
      />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="patients/:id" element={<PatientDetailPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="encounters" element={<EncountersPage />} />
        <Route path="lab" element={<LabOrdersPage />} />
        <Route path="pharmacy" element={<PharmacyPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="insurance" element={<InsurancePage />} />
        <Route path="ipd" element={<IPDPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="shifts" element={<ShiftsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leave" element={<LeavePage />} />
        <Route path="biometric-devices" element={<BiometricDevicesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="platform/hospitals" element={<PlatformHospitalsPage />} />
        <Route path="platform/analytics" element={<PlatformAnalyticsPage />} />
        <Route path="settings" element={<HospitalSettingsPage />} />
      </Route>
      <Route
        path="patient-portal"
        element={
          <ProtectedRoute>
            <PatientPortalGuard>
              <MainLayout />
            </PatientPortalGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboardPage />} />
        <Route path="appointments" element={<PatientAppointmentsPage />} />
        <Route path="lab-results" element={<PatientLabResultsPage />} />
        <Route path="prescriptions" element={<PatientPrescriptionsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
    </Routes>
  </Suspense>
);
