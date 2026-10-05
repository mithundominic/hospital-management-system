// Responsibility: Leave approval and rejection decision operations

import { SupabaseClient } from "@supabase/supabase-js";

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
