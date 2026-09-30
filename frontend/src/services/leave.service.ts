// Responsibility: API client for leave application submission and review operations
 
import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/apiRoutes";
import type {
  LeaveApplication,
  LeaveApplicationPayload,
} from "@/pages/attendance/attendance.types";

export const getLeaveApplications = async (
  hospitalId: string,
  filters?: { user_id?: string; status?: string },
): Promise<LeaveApplication[]> => {
  const params = new URLSearchParams();
  if (filters?.user_id) params.append("user_id", filters.user_id);
  if (filters?.status) params.append("status", filters.status);

  const url = params.toString()
    ? `${API_ROUTES.hospitals.leaveApplications(hospitalId)}?${params}`
    : API_ROUTES.hospitals.leaveApplications(hospitalId);

  return api.get<LeaveApplication[]>(url);
};

export const createLeaveApplication = async (
  hospitalId: string,
  payload: LeaveApplicationPayload,
): Promise<LeaveApplication> => {
  return api.post<LeaveApplication>(
    API_ROUTES.hospitals.leaveApplications(hospitalId),
    payload,
  );
};

export const approveLeaveApplication = async (
  hospitalId: string,
  leaveId: string,
): Promise<LeaveApplication> => {
  return api.patch<LeaveApplication>(
    API_ROUTES.hospitals.approveLeave(hospitalId, leaveId),
    {},
  );
};

export const rejectLeaveApplication = async (
  hospitalId: string,
  leaveId: string,
  reason: string,
): Promise<LeaveApplication> => {
  return api.patch<LeaveApplication>(
    API_ROUTES.hospitals.rejectLeave(hospitalId, leaveId),
    { reason },
  );
};
