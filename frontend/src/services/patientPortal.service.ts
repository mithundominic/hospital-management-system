// Responsibility: Patient portal API client methods

import { api } from "../lib/api";
import type {
  PatientAppointment,
  PatientLabResult,
  PatientPrescription,
  AppointmentRequest,
} from "../pages/patient-portal/patientPortal.types";

export const patientPortalService = {
  getMyAppointments: (filters?: { status?: string; from_date?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.from_date) params.set("from_date", filters.from_date);
    const query = params.toString();
    return api.get<PatientAppointment[]>(
      `/api/v1/patient-portal/my-appointments${query ? `?${query}` : ""}`,
    );
  },

  requestAppointment: (data: AppointmentRequest) =>
    api.post<void, AppointmentRequest>(
      "/api/v1/patient-portal/appointment-requests",
      data,
    ),

  getMyLabResults: () =>
    api.get<PatientLabResult[]>("/api/v1/patient-portal/my-lab-results"),

  getMyPrescriptions: () =>
    api.get<PatientPrescription[]>("/api/v1/patient-portal/my-prescriptions"),
};
