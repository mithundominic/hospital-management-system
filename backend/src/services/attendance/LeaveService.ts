// Responsibility: Leave application submission and approval operations

import { SupabaseClient } from "@supabase/supabase-js";
import type { LeaveApplication } from "./attendance.types";

export type { LeaveApplication };

export const queryLeaveApplications = async (
  supabase: SupabaseClient,
  hospitalId: string,
  filters: { user_id?: string; status?: string } = {},
) => {
  let query = supabase
    .from("leave_applications")
    .select("*, user:auth.users(email)")
    .eq("hospital_id", hospitalId)
    .order("created_at", { ascending: false });

  if (filters.user_id) query = query.eq("user_id", filters.user_id);
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createLeaveApplication = async (
  supabase: SupabaseClient,
  hospitalId: string,
  userId: string,
  payload: {
    leave_type: string;
    start_date: string;
    end_date: string;
    days_count: number;
    reason?: string;
  },
) => {
  const { data, error } = await supabase
    .from("leave_applications")
    .insert({ hospital_id: hospitalId, user_id: userId, ...payload })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const approveLeave = async (
  supabase: SupabaseClient,
  leaveId: string,
  approverId: string,
  hospitalId?: string,
) => {
  const { data: existing, error: fetchErr } = await supabase
    .from("leave_applications")
    .select("user_id, hospital_id")
    .eq("id", leaveId)
    .single();

  if (fetchErr || !existing) throw new Error("Leave application not found");
  if (hospitalId && existing.hospital_id !== hospitalId) {
    throw new Error("Leave application not found in this hospital");
  }
  if (existing.user_id === approverId) {
    throw new Error("Self-approval is forbidden");
  }

  const { data, error } = await supabase
    .from("leave_applications")
    .update({
      status: "approved",
      approved_by: approverId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", leaveId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const rejectLeave = async (
  supabase: SupabaseClient,
  leaveId: string,
  approverId: string,
  reason: string,
  hospitalId?: string,
) => {
  let query = supabase
    .from("leave_applications")
    .update({
      status: "rejected",
      approved_by: approverId,
      approved_at: new Date().toISOString(),
      rejection_reason: reason,
    })
    .eq("id", leaveId);

  if (hospitalId) query = query.eq("hospital_id", hospitalId);

  const { data, error } = await query.select().single();
  if (error) throw error;
  return data;
};
