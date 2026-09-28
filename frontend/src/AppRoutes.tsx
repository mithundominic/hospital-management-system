// Responsibility: Define application route hierarchy and layout bindings

import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import PatientsPage from '@/pages/patients/PatientsPage';
import PatientDetailPage from '@/pages/patients/PatientDetailPage';
import AppointmentsPage from '@/pages/appointments/AppointmentsPage';
import EncountersPage from '@/pages/encounters/EncountersPage';
import LabOrdersPage from '@/pages/lab/LabOrdersPage';
import PharmacyPage from '@/pages/pharmacy/PharmacyPage';
import BillingPage from '@/pages/billing/BillingPage';
import InsurancePage from '@/pages/insurance/InsurancePage';
import IPDPage from '@/pages/ipd/IPDPage';
import StaffPage from '@/pages/staff/StaffPage';
import ShiftsPage from '@/pages/shifts/ShiftsPage';
import ReportsPage from '@/pages/reports/ReportsPage';

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
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
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
