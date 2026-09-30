// Responsibility: API client for staff attendance tracking and check-in/out operations
 
import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/apiRoutes";
import type {
  AttendanceRecord,
  CheckInPayload,
  CheckOutPayload,
} from "@/pages/attendance/attendance.types";

export const getAttendanceRecords = async (
  hospitalId: string,
  filters?: { date?: string; user_id?: string; status?: string },
): Promise<AttendanceRecord[]> => {
  const params = new URLSearchParams();
  if (filters?.date) params.append("date", filters.date);
  if (filters?.user_id) params.append("user_id", filters.user_id);
  if (filters?.status) params.append("status", filters.status);

  const url = params.toString()
    ? `${API_ROUTES.hospitals.attendance(hospitalId)}?${params}`
    : API_ROUTES.hospitals.attendance(hospitalId);

  return api.get<AttendanceRecord[]>(url);
};

export const getMyAttendanceRecords = async (
  hospitalId: string,
): Promise<AttendanceRecord[]> => {
  return api.get<AttendanceRecord[]>(
    API_ROUTES.hospitals.myAttendance(hospitalId),
  );
};

export const checkIn = async (
  hospitalId: string,
  payload: CheckInPayload,
): Promise<AttendanceRecord> => {
  return api.post<AttendanceRecord>(
    API_ROUTES.hospitals.checkIn(hospitalId),
    payload,
  );
};

export const checkOut = async (
  hospitalId: string,
  payload: CheckOutPayload,
): Promise<AttendanceRecord> => {
  return api.post<AttendanceRecord>(
    API_ROUTES.hospitals.checkOut(hospitalId),
    payload,
  );
};
