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

export { approveLeave, rejectLeave } from "./LeaveDecisionService";

