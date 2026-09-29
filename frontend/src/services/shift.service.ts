// Responsibility: Shift domain service for scheduling and managing staff shifts

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type { Shift } from "@/types";

export interface CreateShiftPayload {
  user_id: string;
  shift_date: string;
  shift_type: string;
  start_time: string;
  end_time: string;
}

export const getHospitalShifts = async (
  hospitalId: string,
): Promise<Shift[]> => {
  return await api.get<Shift[]>(API_ROUTES.hospitals.shifts(hospitalId));
};

export const createHospitalShift = async (
  hospitalId: string,
  payload: CreateShiftPayload,
): Promise<Shift> => {
  return await api.post<Shift>(
    API_ROUTES.hospitals.shifts(hospitalId),
    payload,
  );
};

export const updateHospitalShift = async (
  hospitalId: string,
  shiftId: string,
  payload: Partial<CreateShiftPayload>,
): Promise<Shift> => {
  return await api.patch<Shift>(
    API_ROUTES.hospitals.shift(hospitalId, shiftId),
    payload,
  );
};
