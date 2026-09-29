// Responsibility: HTTP API calls and transport for appointment scheduling

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type { Appointment } from "@/types";
import type {
  AppointmentFormData,
  DoctorOption,
} from "@/pages/appointments/appointment.types";

export const getHospitalAppointments = async (
  hospitalId: string,
  date?: string,
): Promise<Appointment[]> => {
  const data = await api.get<Appointment[]>(
    API_ROUTES.hospitals.appointments(hospitalId, date),
  );
  return data || [];
};

export const getHospitalDoctors = async (
  hospitalId: string,
): Promise<DoctorOption[]> => {
  const data = await api.get<DoctorOption[]>(
    API_ROUTES.hospitals.doctors(hospitalId),
  );
  return data || [];
};

export const createHospitalAppointment = async (
  hospitalId: string,
  data: Partial<AppointmentFormData>,
): Promise<Appointment> => {
  return api.post<Appointment>(
    API_ROUTES.hospitals.appointments(hospitalId),
    data,
  );
};

export const updateHospitalAppointment = async (
  hospitalId: string,
  appointmentId: string,
  updates: Partial<AppointmentFormData> | { status: string },
): Promise<Appointment> => {
  return api.patch<Appointment>(
    API_ROUTES.hospitals.appointment(hospitalId, appointmentId),
    updates,
  );
};
