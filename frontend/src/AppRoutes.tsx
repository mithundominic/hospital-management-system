// Responsibility: Define application route hierarchy and layout bindings

import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { APP_ROUTES } from "@/constants";
import * as Pages from "./AppRoutes.pages";
import { platformRoutes } from "./AppRoutes.platform";
import { patientPortalRoutes } from "./AppRoutes.portal";

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
        {platformRoutes}
        <Route path="settings" element={<Pages.HospitalSettingsPage />} />
      </Route>
      {patientPortalRoutes}
      <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
    </Routes>
  </Suspense>
);
