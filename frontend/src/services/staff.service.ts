// Responsibility: Staff domain service for managing hospital memberships and invitations

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";

export interface MembershipDto {
  id: string;
  user_email?: string;
  user_name?: string;
  user_phone?: string;
  role_name: string;
  status: string;
}

export interface InviteStaffPayload {
  email: string;
  role_name: string;
  status?: string;
}

export const getHospitalMemberships = async (
  hospitalId: string,
): Promise<MembershipDto[]> => {
  return await api.get<MembershipDto[]>(
    API_ROUTES.hospitals.memberships(hospitalId),
  );
};

export const inviteStaffMember = async (
  hospitalId: string,
  payload: InviteStaffPayload,
): Promise<MembershipDto> => {
  return await api.post<MembershipDto>(
    API_ROUTES.hospitals.memberships(hospitalId),
    payload,
  );
};
