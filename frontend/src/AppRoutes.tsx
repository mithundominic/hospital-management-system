// Responsibility: Define application route hierarchy and layout bindings

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { PlatformGuard } from "@/pages/platform/PlatformGuard";
import { APP_ROUTES } from "@/constants";
import * as Pages from "./AppRoutes.pages";

const PatientPortalGuard = lazy(
  () => import("@/pages/patient-portal/PatientPortalGuard"),
);

const LoadingFallback = () => <LoadingSpinner size="lg" fullScreen />;

export const AppRoutes = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Routes>
      <Route path={APP_ROUTES.HOME} element={<Pages.HomePage />} />
      <Route path={APP_ROUTES.LOGIN} element={<Pages.LoginPage />} />
      <Route path={APP_ROUTES.ONBOARDING} element={<Pages.OnboardingPage />} />
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
        <Route path="dashboard" element={<Pages.DashboardPage />} />
        <Route path="patients" element={<Pages.PatientsPage />} />
        <Route path="patients/:id" element={<Pages.PatientDetailPage />} />
        <Route path="appointments" element={<Pages.AppointmentsPage />} />
        <Route path="encounters" element={<Pages.EncountersPage />} />
        <Route path="lab" element={<Pages.LabOrdersPage />} />
        <Route path="pharmacy" element={<Pages.PharmacyPage />} />
        <Route path="billing" element={<Pages.BillingPage />} />
        <Route path="insurance" element={<Pages.InsurancePage />} />
        <Route path="ipd" element={<Pages.IPDPage />} />
        <Route path="staff" element={<Pages.StaffPage />} />
        <Route path="shifts" element={<Pages.ShiftsPage />} />
        <Route path="attendance" element={<Pages.AttendancePage />} />
        <Route path="leave" element={<Pages.LeavePage />} />
        <Route
          path="biometric-devices"
          element={<Pages.BiometricDevicesPage />}
        />
        <Route path="reports" element={<Pages.ReportsPage />} />
        <Route path="analytics" element={<Pages.AnalyticsPage />} />
        <Route
          path="platform/hospitals"
          element={
            <PlatformGuard>
              <Pages.PlatformHospitalsPage />
            </PlatformGuard>
          }
        />
        <Route
          path="platform/analytics"
          element={
            <PlatformGuard>
              <Pages.PlatformAnalyticsPage />
            </PlatformGuard>
          }
        />
        <Route path="settings" element={<Pages.HospitalSettingsPage />} />
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
        <Route index element={<Pages.PatientDashboardPage />} />
        <Route
          path="appointments"
          element={<Pages.PatientAppointmentsPage />}
        />
        <Route path="lab-results" element={<Pages.PatientLabResultsPage />} />
        <Route
          path="prescriptions"
          element={<Pages.PatientPrescriptionsPage />}
        />
      </Route>
      <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
    </Routes>
  </Suspense>
);
