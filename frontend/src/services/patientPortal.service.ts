// Responsibility: Patient portal API client methods

import { api } from "../lib/api";
import type {
  PatientAppointment,
  PatientLabResult,
  PatientPrescription,
  PatientRegistration,
  AppointmentRequest,
} from "../pages/patient-portal/patientPortal.types";

export const patientPortalService = {
  checkHasPatientRole: () =>
    api.get<{ hasRole: boolean }>("/patient-portal/has-patient-role"),

  getMyRegistrations: () =>
    api.get<PatientRegistration[]>("/patient-portal/my-registrations"),

  getMyAppointments: (filters?: { status?: string; from_date?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.from_date) params.set("from_date", filters.from_date);
    const query = params.toString();
    return api.get<PatientAppointment[]>(
      `/patient-portal/my-appointments${query ? `?${query}` : ""}`,
    );
  },

  requestAppointment: (data: AppointmentRequest) =>
    api.post<void, AppointmentRequest>(
      "/patient-portal/appointment-requests",
      data,
    ),

  getMyLabResults: () =>
    api.get<PatientLabResult[]>("/patient-portal/my-lab-results"),

  getMyPrescriptions: () =>
    api.get<PatientPrescription[]>("/patient-portal/my-prescriptions"),
};
