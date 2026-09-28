// Responsibility: Define application route hierarchy and layout bindings

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import { APP_ROUTES } from "@/constants";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
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

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Routes>
      <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
      <Route
        path={APP_ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
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
        <Route path="reports" element={<ReportsPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={APP_ROUTES.DASHBOARD} replace />}
      />
    </Routes>
  </Suspense>
);
