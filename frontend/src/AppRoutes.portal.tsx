// Responsibility: Patient portal route subtree with portal guard and layout wrapper

import { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import * as Pages from "./AppRoutes.pages";

const PatientPortalGuard = lazy(
  () => import("@/pages/patient-portal/PatientPortalGuard"),
);

export const patientPortalRoutes = (
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
    <Route path="appointments" element={<Pages.PatientAppointmentsPage />} />
    <Route path="lab-results" element={<Pages.PatientLabResultsPage />} />
    <Route path="prescriptions" element={<Pages.PatientPrescriptionsPage />} />
  </Route>
);
